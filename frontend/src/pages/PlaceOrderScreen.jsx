import React, { useContext, useState } from 'react'; // Added useState
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { MapPin, CreditCard, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'; // Added Loader2 for visual feedback

const PlaceOrderScreen = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();
  
  // State to manage loading during the API call
  const [isLoading, setIsLoading] = useState(false);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
  
  const rawPaymentMethod = localStorage.getItem('paymentMethod');
  const paymentMethod = rawPaymentMethod ? JSON.parse(rawPaymentMethod) : 'Not Selected';

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const placeOrderHandler = async () => {
    // Prevent multiple clicks if already loading
    if (isLoading) return;

    try {
      setIsLoading(true); // Start loading

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const orderData = {
        orderItems: cartItems.map(item => ({
          ...item,
          product: item.product || item._id 
        })),
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        paymentMethod: paymentMethod,
        itemsPrice: totalPrice,
        shippingPrice: 0, 
        taxPrice: 0,      
        totalPrice: totalPrice,
      };

      // Changed back to relative paths to utilize your package.json proxy correctly
      const { data } = await axios.post('/api/orders', orderData, config);

      // Clear cart locally and on the server
      setCartItems([]);
      await axios.put('/api/users/cart', { cartItems: [] }, config);
      
      navigate(`/order/${data._id}`);
    } catch (err) {
      console.error("Order Error:", err.response ? err.response.data : err);
      alert(err.response?.data?.message || "Failed to place order. Check console.");
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '100px' }}>
      <h1 style={{ marginBottom: '30px' }}>Final Review</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        {/* LEFT SIDE: SUMMARY DETAILS */}
        <div style={{ flex: 2 }}>
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

          <div className="product-card" style={{ padding: '25px', marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--primary)' }}>
              <CreditCard size={20} color="var(--accent)" /> Payment Method
            </h3>
            <div style={{ padding: '10px 15px', background: '#f8fafc', borderRadius: '8px', display: 'inline-block', border: '1px solid #e2e8f0' }}>
               <strong style={{ color: 'var(--accent)' }}>{paymentMethod}</strong>
            </div>
          </div>

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
                gap: '10px',
                opacity: (cartItems.length === 0 || isLoading) ? 0.7 : 1, // Visual feedback for disabled
                cursor: (cartItems.length === 0 || isLoading) ? 'not-allowed' : 'pointer'
              }}
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || isLoading} // Button disabled when loading
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </>
              ) : (
                <>
                  Confirm Order <ArrowRight size={20} />
                </>
              )}
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