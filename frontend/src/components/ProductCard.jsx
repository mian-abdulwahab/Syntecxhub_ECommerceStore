import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Lock } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleAction = (e) => {
    e.preventDefault(); // Prevents navigating to the details page
    
    if (!userInfo) {
      // If not logged in, redirect to login page
      navigate('/login');
    } else if (onAddToCart) {
      // If logged in, execute the add to cart logic
      onAddToCart();
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
        />
        <div style={{ padding: '20px' }}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>{product.category}</p>
          <h3 style={{ margin: '5px 0' }}>{product.name}</h3>
          <p style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--accent)' }}>${product.price}</p>
          
          <button 
            onClick={handleAction}
            className="btn-primary" 
            style={{ 
              width: '100%', 
              marginTop: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              // Visual feedback: change color if locked
              backgroundColor: !userInfo ? '#475569' : 'var(--primary)',
              opacity: !userInfo ? 0.9 : 1
            }}
          >
            {userInfo ? (
              <>
                <ShoppingCart size={18} /> Add to Cart
              </>
            ) : (
              <>
                <Lock size={18} /> Login to Buy
              </>
            )}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;