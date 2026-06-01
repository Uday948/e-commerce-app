from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.metrics import cart_items_added_total

router = APIRouter(prefix="/cart", tags=["cart"])

# In-memory cart store keyed by session_id (Redis in Phase 2)
_carts: dict[str, list[dict]] = {}


class CartAddRequest(BaseModel):
    session_id: str
    product_id: int
    quantity: int = 1


class CartRemoveRequest(BaseModel):
    session_id: str
    product_id: int


@router.get("/{session_id}")
async def get_cart(session_id: str):
    return {"session_id": session_id, "items": _carts.get(session_id, [])}


@router.post("/")
async def add_to_cart(body: CartAddRequest):
    cart = _carts.setdefault(body.session_id, [])
    for item in cart:
        if item["product_id"] == body.product_id:
            item["quantity"] += body.quantity
            break
    else:
        cart.append({"product_id": body.product_id, "quantity": body.quantity})
    cart_items_added_total.labels(product_id=str(body.product_id)).inc()
    return {"session_id": body.session_id, "items": cart}


@router.delete("/")
async def remove_from_cart(body: CartRemoveRequest):
    cart = _carts.get(body.session_id, [])
    _carts[body.session_id] = [i for i in cart if i["product_id"] != body.product_id]
    return {"session_id": body.session_id, "items": _carts[body.session_id]}


@router.delete("/{session_id}")
async def clear_cart(session_id: str):
    _carts.pop(session_id, None)
    return {"session_id": session_id, "items": []}
