import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Cpu, LogOut, LayoutDashboard, ClipboardList } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  // Safety parse to avoid crashes if localStorage is empty
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;
  const { cartItems, setCartItems } = useContext(CartContext);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setCartItems([]); 
    navigate('/login');
    // Using a simple state update is better than reload, but reload works for clearing cache
    window.location.reload();
  };

  return (
    <nav className="main-nav" style={{ 
      backgroundColor: 'white', 
      borderBottom: '1px solid #f1f5f9', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000 
    }}> 
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', padding: '0 20px' }}>
        
        {/* Logo */}
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <Cpu fill="var(--accent)" color="var(--accent)" /> MG TECH
        </Link>
        
        {/* Right Links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* 1. ADMIN SECTION */}
          {userInfo && userInfo.isAdmin && (
            <div style={{ display: 'flex', gap: '15px', borderRight: '1px solid #e2e8f0', paddingRight: '15px' }}>
              <Link to="/admin/productlist" className="admin-link" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
                <LayoutDashboard size={18} /> Products
              </Link>
              <Link to="/admin/orderlist" className="admin-link" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
                <ClipboardList size={18} /> Orders
              </Link>
            </div>
          )}

          {/* 2. CUSTOMER CART */}
          {userInfo && !userInfo.isAdmin && (
            <Link to="/cart" className="cart-link" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'var(--primary)' }}>
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="cart-badge" style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--accent)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '50%', fontWeight: 'bold', border: '2px solid white' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* 3. USER PROFILE / AUTH SECTION */}
          {userInfo ? (
            <div className="user-section" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.95rem' }}>
                <User size={18} /> 
                <span className="hide-mobile">{userInfo.name.split(' ')[0]}</span>
              </Link>
              <button onClick={logoutHandler} className="logout-btn" title="Logout" style={{ background: '#fee2e2', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', transition: '0.2s' }}>
                <LogOut size={18} color="#ef4444" />
              </button>
            </div>
          ) : (
            <div className="auth-buttons" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <Link to="/login" className="login-link" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600' }}>Login</Link>
              <Link to="/register" className="signup-btn" style={{ background: 'var(--primary)', color: 'white', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;