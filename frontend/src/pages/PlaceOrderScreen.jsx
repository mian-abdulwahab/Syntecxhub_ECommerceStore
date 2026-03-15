import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { MapPin, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';

const PlaceOrderScreen = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();
  
  // 1. Fetching data stored in previous steps
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
  
  // Ensure we parse the payment method correctly (removes extra quotes)
  const rawPaymentMethod = localStorage.getItem('paymentMethod');
  const paymentMethod = rawPaymentMethod ? JSON.parse(rawPaymentMethod) : 'Not Selected';

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const placeOrderHandler = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Cleaned up URLs to use the proxy set in package.json
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod, // This now correctly passes "Cash" or "PayPal"
        totalPrice,
      }, config);

      // Clear cart globally and in DB
      setCartItems([]);
      await axios.put('/api/users/cart', { cartItems: [] }, config);
      
      // Navigate to the Success page
      navigate(`/order/${data._id}`);
    } catch (err) {
      console.error("Order Error:", err);
      // You could trigger a Toast here if you have it available
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '100px' }}>
      <h1 style={{ marginBottom: '30px' }}>Final Review</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        {/* LEFT SIDE: SUMMARY DETAILS */}
        <div style={{ flex: 2 }}>
          {/* Shipping Section */}
          <div className="product-card" style={{ padding: '25px', marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--primary)' }}>
              <MapPin size={20} color="var(--accent)" /> Shipping Details
            </h3>
            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              <strong>Address:</strong> {shippingAddress.address}<br />
              <strong>Location:</strong> {shippingAddress.city}, {shippingAddress.postalCode}<br />
              <strong>Country:</strong> {shippingAddress.country}
            </p>
          </div>

          {/* Payment Section */}
          <div className="product-card" style={{ padding: '25px', marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--primary)' }}>
              <CreditCard size={20} color="var(--accent)" /> Payment Method
            </h3>
            <div style={{ padding: '10px 15px', background: '#f8fafc', borderRadius: '8px', display: 'inline-block', border: '1px solid #e2e8f0' }}>
               <strong style={{ color: 'var(--accent)' }}>{paymentMethod}</strong>
            </div>
          </div>

          {/* Items Section */}
          <div className="product-card" style={{ padding: '25px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--primary)' }}>
              <ShoppingBag size={20} color="var(--accent)" /> Order Items
            </h3>
            {cartItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span>{item.name} <span style={{ color: '#94a3b8', marginLeft: '5px' }}>x {item.qty}</span></span>
                </div>
                <span style={{ fontWeight: '600' }}>${(item.qty * item.price).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: TOTAL & ACTION */}
        <div style={{ flex: 1 }}>
          <div className="product-card" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
            <h2 style={{ marginTop: 0 }}>Order Summary</h2>
            <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#64748b' }}>
                <span>Subtotal:</span>
                <span>${totalPrice.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#64748b' }}>
                <span>Shipping:</span>
                <span style={{ color: '#10b981' }}>Free</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span style={{ color: 'var(--accent)' }}>${totalPrice.toLocaleString()}</span>
            </div>

            <button 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                marginTop: '30px', 
                padding: '15px', 
                fontSize: '1.1rem', 
                border: 'none', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0}
            >
              Confirm Order <ArrowRight size={20} />
            </button>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginTop: '15px' }}>
                By placing your order, you agree to our terms of service.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceOrderScreen;