import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from 'axios';
import { CheckCircle, Package, Truck, ArrowLeft, Loader2 } from 'lucide-react'; // Added Loader2

const OrderSuccessScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        // Safety: If no user info, send them to login
        if (!userInfo) {
          navigate('/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        // FIX: Removed http://localhost:5000
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order", err);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="var(--accent)" style={{ margin: '0 auto 20px' }} />
        <h2>Loading Receipt...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '60px', textAlign: 'center', paddingBottom: '100px' }}>
      <CheckCircle size={80} color="#22c55e" style={{ marginBottom: '20px' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Order Placed!</h1>
      <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
        We've received your order. Order ID: <strong>{order._id}</strong>
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px', 
        marginTop: '40px', 
        textAlign: 'left' 
      }}>
        
        {/* Order Details */}
        <div className="product-card" style={{ padding: '30px' }}>
          <h3>Shipping To</h3>
          <p style={{ color: '#475569', marginTop: '10px', lineHeight: '1.6' }}>
            {/* Added fallback for user name to prevent crashes */}
            <strong>Name:</strong> {order.user?.name || 'Customer'}<br />
            <strong>Address:</strong> {order.shippingAddress.address}<br />
            <strong>City:</strong> {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />
          <h3>Status</h3>
          <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
            <div style={{ flex: 1, padding: '15px', background: '#f0fdf4', borderRadius: '10px', textAlign: 'center', color: '#166534', border: '1px solid #bbf7d0' }}>
               <Package size={20} /> <br/> Confirmed
            </div>
            <div style={{ flex: 1, padding: '15px', background: '#f8fafc', borderRadius: '10px', textAlign: 'center', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
               <Truck size={20} /> <br/> Processing
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="product-card" style={{ padding: '30px', height: 'fit-content' }}>
          <h3>Order Summary</h3>
          {order.orderItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0', fontSize: '0.95rem' }}>
              <span style={{ color: '#475569' }}>{item.name} <span style={{ color: '#94a3b8' }}>x{item.qty}</span></span>
              <span style={{ fontWeight: '600' }}>${(item.qty * item.price).toLocaleString()}</span>
            </div>
          ))}
          <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>
            <span>Total Paid</span>
            <span>${order.totalPrice.toLocaleString()}</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px', textAlign: 'right' }}>
            Payment Method: {order.paymentMethod}
          </p>
        </div>
      </div>

      <Link to="/" className="btn-primary" style={{ marginTop: '50px', display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', padding: '15px 30px' }}>
        <ArrowLeft size={18} /> Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccessScreen;