import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Cpu, LogOut, LayoutDashboard, ClipboardList } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const { cartItems, setCartItems } = useContext(CartContext);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setCartItems([]); 
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="main-nav"> 
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        
        {/* Logo */}
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <Cpu fill="var(--accent)" color="var(--accent)" /> MG TECH
        </Link>
        
        {/* Right Links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          
          {/* 1. ADMIN SECTION (Enhanced with Order Management) */}
          {userInfo && userInfo.isAdmin && (
            <div style={{ display: 'flex', gap: '20px', borderRight: '1px solid #ddd', paddingRight: '20px' }}>
              <Link to="/admin/productlist" className="admin-link" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>
                <LayoutDashboard size={18} /> Products
              </Link>
              <Link to="/admin/orderlist" className="admin-link" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                <ClipboardList size={18} /> Orders
              </Link>
            </div>
          )}

          {/* 2. CUSTOMER CART (Shown ONLY to Logged-in Customers) */}
          {userInfo && !userInfo.isAdmin && (
            <Link to="/cart" className="cart-link" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'var(--primary)' }}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="cart-badge" style={{ position: 'absolute', top: '-8px', right: '-10px', background: 'var(--accent)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '50%', fontWeight: 'bold' }}>
                  {cartCount}
                </span>
              )}
              Cart
            </Link>
          )}

          {/* 3. USER PROFILE / AUTH SECTION */}
          {userInfo ? (
            <div className="user-section" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={18} /> {userInfo.name.split(' ')[0]}
              </Link>
              <button onClick={logoutHandler} className="logout-btn" style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <LogOut size={18} color="#ef4444" />
              </button>
            </div>
          ) : (
            <div className="auth-buttons" style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="login-link" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '500' }}>Login</Link>
              <Link to="/register" className="signup-btn" style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;