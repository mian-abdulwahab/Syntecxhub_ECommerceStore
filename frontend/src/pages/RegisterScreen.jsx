import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // FIX 1: Removed 'http://localhost:5000'. 
      // This allows the browser to use the proxy (local) or the current domain (Render).
      const { data } = await axios.post('/api/users', { name, email, password });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setToastMsg('Account created! Welcome, ' + name);
      setShowToast(true);
      
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 2000);

    } catch (err) {
      // FIX 2: Added Optional Chaining (?.) to prevent "Cannot read properties of undefined"
      // If the network fails, err.response is undefined. This check prevents a crash.
      const errorResponse = err.response?.data?.message 
        ? err.response.data.message 
        : "Network Error: Cannot connect to server";

      setToastMsg(errorResponse);
      setShowToast(true);
      
      // Safety log
      console.log("Error details:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px' 
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
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
        
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          autoComplete="new-password" 
        />
        
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
        
        <button type="submit" className="btn-primary" style={{ border: 'none', width: '100%', cursor: 'pointer' }}>
          Register
        </button>
        
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
        </p>
      </form>

      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default RegisterScreen;