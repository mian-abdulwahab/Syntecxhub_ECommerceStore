import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // 1. Import Context
import { CreditCard, Banknote } from 'lucide-react'; // Visual icons

const PaymentScreen = () => {
  const { cart, savePaymentMethod } = useContext(CartContext); // 2. Pull from context
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const navigate = useNavigate();

  // If the user already picked a method, keep it selected
  useEffect(() => {
    if (cart?.paymentMethod) {
      setPaymentMethod(cart.paymentMethod);
    }
  }, [cart]);

  const submitHandler = (e) => {
    e.preventDefault();
    // 3. Save to context (which handles localStorage for you)
    savePaymentMethod(paymentMethod); 
    navigate('/placeorder');
  };

  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)' }}>
      <form onSubmit={submitHandler} className="product-card" style={{ padding: '40px', width: '450px' }}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Payment Method</h2>
        
        {/* PayPal Option */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '15px', borderRadius: '12px',
            border: paymentMethod === 'PayPal' ? '2px solid var(--accent)' : '2px solid #f1f5f9',
            background: paymentMethod === 'PayPal' ? '#f8fafc' : 'white',
            transition: '0.3s'
          }}>
            <input 
              type="radio" name="paymentMethod" id="PayPal" value="PayPal" 
              checked={paymentMethod === 'PayPal'} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              style={{ width: '18px', height: '18px' }}
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
            transition: '0.3s'
          }}>
            <input 
              type="radio" name="paymentMethod" id="Cash" value="Cash" 
              checked={paymentMethod === 'Cash'} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              style={{ width: '18px', height: '18px' }}
            />
            <Banknote size={20} color={paymentMethod === 'Cash' ? 'var(--accent)' : '#64748b'} />
            <span style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '500' }}>Cash on Delivery</span>
          </label>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold' }}>
          Continue to Order
        </button>
      </form>
    </div>
  );
};

export default PaymentScreen;