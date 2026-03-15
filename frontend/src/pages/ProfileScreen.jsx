import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Check, X, Eye, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user orders", err);
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userInfo.token]);

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        {/* LEFT: USER INFO CARD */}
        <div className="product-card" style={{ padding: '30px', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
              {userInfo.name.charAt(0)}
            </div>
            <h2 style={{ margin: 0 }}>{userInfo.name}</h2>
            <p style={{ color: '#64748b' }}>{userInfo.email}</p>
          </div>
          <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Account Type: <strong style={{ color: 'var(--primary)' }}>{userInfo.isAdmin ? 'Administrator' : 'Customer'}</strong>
          </p>
        </div>

        {/* RIGHT: ORDER HISTORY */}
        <div style={{ flex: 2 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Package size={24} color="var(--accent)" /> My Order History
          </h2>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="product-card" style={{ padding: '40px', textAlign: 'center' }}>
              <ShoppingBag size={50} color="#cbd5e1" style={{ marginBottom: '15px' }} />
              <p style={{ color: '#64748b' }}>You haven't placed any orders yet.</p>
              <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '10px', textDecoration: 'none' }}>Go Shopping</Link>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <tr>
                    <th style={{ padding: '15px', color: '#64748b', fontSize: '0.9rem' }}>ID</th>
                    <th style={{ padding: '15px', color: '#64748b', fontSize: '0.9rem' }}>DATE</th>
                    <th style={{ padding: '15px', color: '#64748b', fontSize: '0.9rem' }}>TOTAL</th>
                    <th style={{ padding: '15px', color: '#64748b', fontSize: '0.9rem' }}>PAID</th>
                    <th style={{ padding: '15px', color: '#64748b', fontSize: '0.9rem' }}>DELIVERED</th>
                    <th style={{ padding: '15px', color: '#64748b', fontSize: '0.9rem' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px', fontSize: '0.8rem', color: '#94a3b8' }}>{order._id.substring(0, 10)}</td>
                      <td style={{ padding: '15px' }}>{order.createdAt.substring(0, 10)}</td>
                      <td style={{ padding: '15px', fontWeight: '600' }}>${order.totalPrice.toFixed(2)}</td>
                      <td style={{ padding: '15px' }}>
                        {order.isPaid ? <Check size={18} color="#10b981" /> : <X size={18} color="#ef4444" />}
                      </td>
                      <td style={{ padding: '15px' }}>
                        {order.isDelivered ? (
                          <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '500' }}>Delivered</span>
                        ) : (
                          <span style={{ color: '#f97316', fontSize: '0.85rem' }}>Processing</span>
                        )}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <Link to={`/order/${order._id}`} style={{ color: 'var(--accent)' }}>
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;