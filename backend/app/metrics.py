from prometheus_client import Counter

orders_total = Counter(
    "ecom_orders_total",
    "Total number of orders placed",
)

cart_items_added_total = Counter(
    "ecom_cart_items_added_total",
    "Total number of items added to cart",
    ["product_id"],
)

product_views_total = Counter(
    "ecom_product_views_total",
    "Total number of product detail page views",
    ["product_id"],
)
