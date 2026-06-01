import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, getSessionId } from "../api/cart";
import { placeOrder } from "../api/orders";

export default function Checkout() {
  const [items, setItems] = useState<{ product_id: number; quantity: number }[]>([]);
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCart(getSessionId()).then((c) => setItems(c.items));
  }, []);

  const handlePlaceOrder = async () => {
    const order = await placeOrder(items);
    setOrderId(order.id);
    setPlaced(true);
    localStorage.removeItem("cart_session");
  };

  if (placed) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Order Placed!</h1>
        <p>Order #{orderId} has been received. Thank you!</p>
        <button onClick={() => navigate("/")} style={{ padding: "0.75rem 1.5rem", cursor: "pointer" }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "500px" }}>
      <h1>Checkout</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {items.map((i) => (
              <li key={i.product_id}>Product #{i.product_id} &times; {i.quantity}</li>
            ))}
          </ul>
          <button
            onClick={handlePlaceOrder}
            style={{ marginTop: "1rem", padding: "0.75rem 1.5rem", fontSize: "1rem", cursor: "pointer" }}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}
