import { Link } from "react-router-dom";
import { Product } from "../api/products";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", maxWidth: "260px" }}>
      {product.image_url && (
        <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "4px" }} />
      )}
      <h3 style={{ margin: "0.5rem 0" }}>{product.name}</h3>
      <p style={{ color: "#666", fontSize: "0.9rem" }}>{product.description}</p>
      <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>${product.price.toFixed(2)}</p>
      <p style={{ color: product.stock > 0 ? "green" : "red", fontSize: "0.85rem" }}>
        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
      </p>
      <Link to={`/products/${product.id}`}>
        <button style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", cursor: "pointer" }}>View Details</button>
      </Link>
    </div>
  );
}
