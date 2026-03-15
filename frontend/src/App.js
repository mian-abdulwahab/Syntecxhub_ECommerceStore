import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeScreen from './pages/HomeScreen';
import ProductScreen from './pages/ProductScreen';
import CartScreen from './pages/CartScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ShippingScreen from './pages/ShippingScreen';
import PaymentScreen from './pages/PaymentScreen';
import PlaceOrderScreen from './pages/PlaceOrderScreen';
import AdminProductList from './pages/AdminProductList';
import AdminOrderList from './pages/AdminOrderList'; // Added this
import ProductEditScreen from './pages/ProductEditScreen';
import AdminRoute from './components/AdminRoute';
import OrderSuccessScreen from './pages/OrderSuccessScreen';
import ProfileScreen from './pages/ProfileScreen';

function App() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* 1. ADMIN HOME REDIRECT: Admin lands on Product List, Customer lands on Home */}
            <Route 
              path="/" 
              element={
                userInfo && userInfo.isAdmin ? (
                  <Navigate to="/admin/productlist" replace />
                ) : (
                  <HomeScreen />
                )
              } 
            />

            {/* Auth & Basic Routes */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            
            {/* Product & Cart Routes */}
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/order/:id" element={<OrderSuccessScreen />} />
            
            {/* Checkout Flow Routes */}
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            
            {/* Admin Routes */}
            <Route path="/admin/productlist" element={<AdminRoute><AdminProductList /></AdminRoute>} />
            <Route path="/admin/product/:id/edit" element={<AdminRoute><ProductEditScreen /></AdminRoute>} />
            <Route path="/admin/orderlist" element={<AdminRoute><AdminOrderList /></AdminRoute>} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;