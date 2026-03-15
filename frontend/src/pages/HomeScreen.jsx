import React, { useState, useEffect, useContext } from "react"; // Added useContext
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";
import { CartContext } from "../context/CartContext"; // Import your CartContext

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Get addToCart function from Context
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Function to handle both the logic and the visual feedback
  const handleAddToCart = (product) => {
    addToCart(product); // Adds to global state (updates Navbar counter)
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
          }}
        >
          Latest Gadgets
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "30px",
            marginBottom: "50px",
          }}
        >
          {products.map((product) => (
            /* Pass the handleAddToCart function as a prop to the card */
            <ProductCard 
              key={product._id} 
              product={product} 
              onAddToCart={() => handleAddToCart(product)} 
            />
          ))}
        </div>
      </div>

      {/* Toast Notification Component */}
      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default HomeScreen;