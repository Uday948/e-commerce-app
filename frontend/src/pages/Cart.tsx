import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cart as CartType, getCart, getSessionId, removeFromCart } from "../api/cart";

export default function Cart() {
  const [cart, setCart] = useState<CartType | null>(null);
  const navigate = useNavigate();

  const refresh = () => getCart(getSessionId()).then(setCart);

  useEffect(() => { refresh(); }, []);

  const handleRemove = async (productId: number) => {
    await removeFromCart(productId);
    refresh();
  };

  if (!cart) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>Your Cart</h1>
      {cart.items.length === 0 && <p>Your cart is empty.</p>}
      {cart.items.map((item) => (
        <div key={item.product_id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
          <span>Product #{item.product_id} &times; {item.quantity}</span>
          <button onClick={() => handleRemove(item.product_id)} style={{ cursor: "pointer" }}>Remove</button>
        </div>
      ))}
      {cart.items.length > 0 && (
        <button
          onClick={() => navigate("/checkout")}
          style={{ marginTop: "1rem", padding: "0.75rem 1.5rem", fontSize: "1rem", cursor: "pointer" }}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}
