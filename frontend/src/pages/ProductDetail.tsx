import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToCart } from "../api/cart";
import { getProduct, Product } from "../api/products";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) getProduct(Number(id)).then(setProduct);
  }, [id]);

  const handleAdd = async () => {
    if (!product) return;
    await addToCart(product.id);
    setMessage("Added to cart!");
    setTimeout(() => setMessage(""), 2000);
  };

  if (!product) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      {product.image_url && (
        <img src={product.image_url} alt={product.name} style={{ width: "100%", borderRadius: "8px" }} />
      )}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>${product.price.toFixed(2)}</p>
      <p>Stock: {product.stock}</p>
      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", cursor: "pointer" }}
      >
        Add to Cart
      </button>
      {message && <p style={{ color: "green", marginTop: "0.5rem" }}>{message}</p>}
    </div>
  );
}
