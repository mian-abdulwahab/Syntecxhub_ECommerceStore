import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; 
import { CreditCard, Banknote, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

const PaymentScreen = () => {
  const { cart, savePaymentMethod } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const navigate = useNavigate();

  // Safety Check: Pull shipping address to verify user didn't skip a step
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));

  useEffect(() => {
    // 1. If no shipping address, they shouldn't be here
    if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping');
      return;
    }

    // 2. Load existing selection from context/localStorage
    if (cart?.paymentMethod) {
      setPaymentMethod(cart.paymentMethod);
    }
  }, [cart, navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Save selection and move forward
    savePaymentMethod(paymentMethod); 
    navigate('/placeorder');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', padding: '20px' }}>
      
      {/* Optional: Simple Back Link for better UX */}
      <button 
        onClick={() => navigate('/shipping')}
        style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', cursor: 'pointer', marginBottom: '20px', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Shipping
      </button>

      <form onSubmit={submitHandler} className="product-card" style={{ padding: '40px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center', color: 'var(--primary)' }}>Payment Method</h2>
        
        {/* PayPal Option */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '15px', borderRadius: '12px',
            border: paymentMethod === 'PayPal' ? '2px solid var(--accent)' : '2px solid #f1f5f9',
            background: paymentMethod === 'PayPal' ? '#f8fafc' : 'white',
            transition: '0.3s',
            boxShadow: paymentMethod === 'PayPal' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
          }}>
            <input 
              type="radio" name="paymentMethod" id="PayPal" value="PayPal" 
              checked={paymentMethod === 'PayPal'} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
            />
            <CreditCard size={20} color={paymentMethod === 'PayPal' ? 'var(--accent)' : '#64748b'} />
            <span style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '500' }}>PayPal or Credit Card</span>
          </label>
        </div>

        {/* Cash Option */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '15px', borderRadius: '12px',
            border: paymentMethod === 'Cash' ? '2px solid var(--accent)' : '2px solid #f1f5f9',
            background: paymentMethod === 'Cash' ? '#f8fafc' : 'white',
            transition: '0.3s',
            boxShadow: paymentMethod === 'Cash' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
          }}>
            <input 
              type="radio" name="paymentMethod" id="Cash" value="Cash" 
              checked={paymentMethod === 'Cash'} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
            />
            <Banknote size={20} color={paymentMethod === 'Cash' ? 'var(--accent)' : '#64748b'} />
            <span style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '500' }}>Cash on Delivery</span>
          </label>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
          Continue to Order
        </button>
      </form>
    </div>
  );
};

export default PaymentScreen;