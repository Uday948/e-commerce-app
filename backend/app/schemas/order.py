from datetime import datetime

from pydantic import BaseModel


class CartItem(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    items: list[CartItem]


class OrderItemResponse(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    unit_price: float

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    status: str
    total: float
    created_at: datetime
    items: list[OrderItemResponse]

    model_config = {"from_attributes": True}
