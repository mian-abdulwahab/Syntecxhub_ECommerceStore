import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';

const CartScreen = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // 1. Calculate Summary
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // 2. Remove from Cart with DB Synchronization
  const removeFromCartHandler = async (id) => {
    const newCart = cartItems.filter((x) => (x.product || x._id) !== id);
    setCartItems(newCart);

    // Safety Check: Only sync if userInfo exists
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      const updatedUser = { ...userInfo, cartItems: newCart };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        // Using relative path for production readiness
        await axios.put('/api/users/cart', { cartItems: newCart }, config);
      } catch (err) {
        console.error("Database sync failed on removal", err);
      }
    }
  };

  // 3. Checkout Handler
  const checkoutHandler = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      // Professional redirect that remembers where the user wanted to go
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  // EMPTY STATE
  if (cartItems.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', padding: '20px' }}>
        <ShoppingBag size={80} color="#cbd5e1" style={{ marginBottom: '20px' }} />
        <h2 style={{ color: '#1e293b', marginBottom: '10px', textAlign: 'center' }}>Your tech bag is empty</h2>
        
        <Link 
          to="/" 
          className="btn-primary" 
          style={{ 
            marginTop: '20px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            textDecoration: 'none',
            width: 'fit-content',
            padding: '12px 30px',
            border: 'none'
          }}
        >
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
      <h1 style={{ marginBottom: '30px', color: 'var(--primary)' }}>Shopping Cart ({totalItems})</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        {/* ITEM LIST */}
        <div style={{ flex: 2 }}>
          {cartItems.map(item => (
            <div key={item.product || item._id} className="product-card" style={{ display: 'flex', padding: '20px', marginBottom: '20px', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <img src={item.image} alt={item.name} style={{ width: '120px', height: '100px', borderRadius: '12px', objectFit: 'cover' }} />
              
              <div style={{ flex: 1, minWidth: '150px' }}>
                <Link to={`/product/${item.product || item._id}`} style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {item.name}
                </Link>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '5px 0' }}>Quantity: {item.qty}</p>
                <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.1rem' }}>${item.price.toLocaleString()}</p>
              </div>

              <button 
                onClick={() => removeFromCartHandler(item.product || item._id)} 
                title="Remove Item"
                style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#fecaca'}
                onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* CHECKOUT SIDEBAR */}
        <div style={{ flex: 1 }}>
          <div className="product-card" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            <hr style={{ border: '0.5px solid #f1f5f9', margin: '20px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: '#64748b' }}>Items Total:</span>
              <span style={{ fontWeight: '600' }}>{totalItems}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              <span>Total:</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>

            <button 
              className="btn-primary" 
              onClick={checkoutHandler}
              style={{ 
                width: '100%', 
                marginTop: '30px', 
                padding: '15px', 
                fontSize: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <CreditCard size={20} /> Proceed to Checkout
            </button>
            
            <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '15px', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>
                Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;