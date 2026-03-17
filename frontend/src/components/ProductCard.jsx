import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Lock } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleAction = (e) => {
    // FIX: stopPropagation prevents the parent <Link> from firing
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (!userInfo) {
      // If not logged in, redirect to login page
      navigate('/login');
    } else if (onAddToCart) {
      // If logged in, execute the add to cart logic
      onAddToCart();
    }
  };

  return (
    <div className="product-card" style={{ transition: 'transform 0.2s', cursor: 'pointer' }}>
      <Link to={`/product/${product._id || product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
          />
        </div>
        
        <div style={{ padding: '20px' }}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {product.category}
          </p>
          <h3 style={{ margin: '5px 0', fontSize: '1.1rem', height: '2.4em', overflow: 'hidden' }}>
            {product.name}
          </h3>
          <p style={{ fontWeight: '700', fontSize: '1.3rem', color: 'var(--accent)', margin: '10px 0' }}>
            ${product.price?.toLocaleString()}
          </p>
          
          <button 
            onClick={handleAction}
            className="btn-primary" 
            style={{ 
              width: '100%', 
              marginTop: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              // Visual feedback for guest users
              backgroundColor: !userInfo ? '#475569' : 'var(--primary)',
              transition: 'background 0.3s'
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