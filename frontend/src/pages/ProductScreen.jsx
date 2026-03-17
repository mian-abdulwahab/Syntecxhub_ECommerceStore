import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, Loader2 } from 'lucide-react'; // Added Loader2

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null); // Changed to null for better checking
  const [loading, setLoading] = useState(true); // Added loading state
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // FIX: Removed http://localhost:5000
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle Loading State
  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <Loader2 className="animate-spin" size={40} color="var(--accent)" />
      </div>
    );
  }

  // Handle Product Not Found
  if (!product) {
    return (
      <div className="container" style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#666' }}>
        <ArrowLeft size={18} /> Back to Electronics
      </Link>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '50px', 
        marginTop: '30px' 
      }}>
        <div style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', display: 'block', objectFit: 'cover' }} 
          />
        </div>
        
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{product.name}</h1>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent)', margin: '20px 0' }}>
            ${product.price?.toLocaleString()}
          </p>
          <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />
          <p style={{ lineHeight: '1.8', color: '#475569' }}>{product.description}</p>
          
          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            background: '#f8fafc', 
            borderRadius: '10px',
            border: '1px solid #e2e8f0' 
          }}>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>
              Status: <strong style={{ color: product.countInStock > 0 ? '#10b981' : '#ef4444' }}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </strong>
            </p>
            
            <button 
              className="btn-primary" 
              style={{ 
                marginTop: '20px', 
                width: '100%', 
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '15px',
                fontSize: '1.1rem'
              }}
              disabled={product.countInStock === 0}
              onClick={() => addToCart(product)}
            >
              <ShoppingCart size={20} /> Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;