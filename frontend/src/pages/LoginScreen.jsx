import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Using clean URL thanks to the proxy in package.json
      const { data } = await axios.post('/api/users/login', { email, password });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      setToastMsg(`Welcome back, ${data.name}!`);
      setShowToast(true);

      setTimeout(() => {
        // PROFESSIONAL REDIRECT LOGIC
        if (data.isAdmin) {
          navigate('/admin/productlist'); // Admin goes to Dashboard
        } else {
          navigate('/'); // Customer goes to Home
        }
        window.location.reload(); 
      }, 1500);

    } catch (err) {
      setToastMsg(err.response && err.response.data.message 
        ? err.response.data.message 
        : 'Invalid Email or Password');
      setShowToast(true);
    }
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px',
      minHeight: 'calc(100vh - 70px)' // Ensures centering works on all screens
    }}>
      <form 
        onSubmit={submitHandler} 
        className="product-card" 
        style={{ 
          padding: '40px', 
          width: '400px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          margin: '0' 
        }}
        autoComplete="off"
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign In</h2>
        
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          autoComplete="none"
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          autoComplete="new-password"
        />
        
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px', border: 'none', cursor: 'pointer' }}>
          Login
        </button>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
          New Customer? <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>Register Here</Link>
        </p>
      </form>

      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default LoginScreen;