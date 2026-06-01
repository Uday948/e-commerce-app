import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem 2rem", background: "#1a1a2e", color: "white", display: "flex", gap: "2rem", alignItems: "center" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "1.2rem" }}>
        ShopApp
      </Link>
      <Link to="/cart" style={{ color: "#ccc", textDecoration: "none" }}>Cart</Link>
    </nav>
  );
}
