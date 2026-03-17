import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";
import { CartContext } from "../context/CartContext";
import { Loader2 } from "lucide-react"; // Added for loading state

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // FIX: Removed http://localhost:5000 to work with proxy/production
        const { data } = await axios.get("/api/products");
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMsg(`${product.name} added to cart!`);
    setShowToast(true);
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <div
        style={{
          background: "var(--primary)",
          color: "white",
          padding: "60px",
          borderRadius: "20px",
          marginTop: "30px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>
          Next-Gen Electronics
        </h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.8 }}>
          Upgrade your lifestyle with the latest tech trends.
        </p>
      </div>

      <div style={{ marginTop: "50px" }}>
        <h2
          style={{
            marginBottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--primary)",
          }}
        >
          Latest Gadgets
        </h2>

        {/* Loading Spinner */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
            <Loader2 className="animate-spin" size={40} color="var(--accent)" />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>
            <h3>No products found.</h3>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "30px",
              marginBottom: "50px",
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </div>

      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default HomeScreen;