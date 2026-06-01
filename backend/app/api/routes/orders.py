from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.metrics import orders_total
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", response_model=OrderResponse, status_code=201)
async def place_order(body: OrderCreate, user_id: int = 1, db: AsyncSession = Depends(get_db)):
    if not body.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")

    total = 0.0
    order_items = []
    for cart_item in body.items:
        product = await db.get(Product, cart_item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {cart_item.product_id} not found")
        if product.stock < cart_item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        product.stock -= cart_item.quantity
        line_total = float(product.price) * cart_item.quantity
        total += line_total
        order_items.append(OrderItem(
            product_id=product.id,
            product_name=product.name,
            quantity=cart_item.quantity,
            unit_price=float(product.price),
        ))

    order = Order(user_id=user_id, total=total, items=order_items)
    db.add(order)
    await db.commit()
    await db.refresh(order)
    orders_total.inc()
    return order


@router.get("/", response_model=list[OrderResponse])
async def list_orders(user_id: int = 1, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Order).where(Order.user_id == user_id).order_by(Order.created_at.desc())
    )
    return result.scalars().all()
