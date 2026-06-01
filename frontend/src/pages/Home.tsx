import { useEffect, useState } from "react";
import { getProducts, Product } from "../api/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products"));
  }, []);

  if (error) return <p style={{ color: "red", padding: "2rem" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Products</h1>
      {products.length === 0 && <p>No products yet.</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
