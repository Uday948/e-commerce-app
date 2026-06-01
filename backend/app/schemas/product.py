from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    description: str = ""
    price: float
    stock: int = 0
    image_url: str = ""


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int

    model_config = {"from_attributes": True}
