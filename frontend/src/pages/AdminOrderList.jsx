import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Check, X, Truck, DollarSign, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import Toast from '../components/Toast';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            };
            // FIX: Using relative path for production readiness
            const { data } = await axios.get('/api/orders', config);
            setOrders(data);
        } catch (err) {
            console.error("Error fetching orders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // SECURITY GUARD: Redirect if not logged in or not an admin
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [navigate]); // Removed userInfo.token from dependency to prevent infinite loops

    // STAT CALCULATIONS
    const totalSales = orders.filter(o => o.isPaid).reduce((acc, item) => acc + item.totalPrice, 0);
    const pendingDeliveries = orders.filter(o => !o.isDelivered).length;
    const unpaidCashOrders = orders.filter(o => o.paymentMethod === 'Cash' && !o.isPaid).length;

    const deliverHandler = async (id) => {
        if (window.confirm('Mark this order as delivered?')) {
            try {
                // FIX: Removed http://localhost:5000
                await axios.put(`/api/orders/${id}/deliver`, {}, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setToastMsg('Order updated: Status is now Delivered & Paid');
                setShowToast(true);
                fetchOrders();
            } catch (err) {
                setToastMsg(err.response?.data?.message || 'Update failed');
                setShowToast(true);
            }
        }
    };

    // If no admin access, render nothing while redirecting
    if (!userInfo || !userInfo.isAdmin) return null;

    return (
        <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
            <h1 style={{ marginBottom: '30px', color: 'var(--primary)' }}>Order Management</h1>

            {/* --- DASHBOARD STAT CARDS --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="product-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '12px' }}>
                        <DollarSign color="#10b981" size={24} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Total Revenue</p>
                        <h2 style={{ margin: 0 }}>${totalSales.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="product-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '12px' }}>
                        <Clock color="#f97316" size={24} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Pending Deliveries</p>
                        <h2 style={{ margin: 0 }}>{pendingDeliveries}</h2>
                    </div>
                </div>

                <div className="product-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '12px' }}>
                        <AlertCircle color="#ef4444" size={24} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Unpaid Cash Orders</p>
                        <h2 style={{ margin: 0 }}>{unpaidCashOrders}</h2>
                    </div>
                </div>
            </div>

            {/* --- ORDERS TABLE --- */}
            <div style={{ background: 'white', borderRadius: '12px', overflowX: 'auto', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Loader2 className="animate-spin" size={40} color="var(--accent)" />
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>ORDER ID</th>
                                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>CUSTOMER</th>
                                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>METHOD</th>
                                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>TOTAL</th>
                                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>PAID</th>
                                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>DELIVERED</th>
                                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px', fontSize: '0.8rem', color: '#94a3b8' }}>{order._id.substring(0, 10)}</td>
                                    <td style={{ padding: '15px', fontWeight: '500' }}>{order.user?.name || 'Guest'}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '6px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: '600',
                                            background: order.paymentMethod === 'PayPal' ? '#e0e7ff' : order.paymentMethod === 'Cash' ? '#dcfce7' : '#f1f5f9',
                                            color: order.paymentMethod === 'PayPal' ? '#4338ca' : order.paymentMethod === 'Cash' ? '#15803d' : '#475569'
                                        }}>
                                            {order.paymentMethod || 'Not Set'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>${order.totalPrice.toFixed(2)}</td>
                                    <td style={{ padding: '15px' }}>
                                        {order.isPaid ? (
                                            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Check size={16} /> <span style={{ fontSize: '0.8rem' }}>{order.paidAt?.substring(0, 10)}</span>
                                            </div>
                                        ) : (
                                            <X color="#ef4444" size={18} />
                                        )}
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        {order.isDelivered ? (
                                            <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '500' }}>{order.deliveredAt?.substring(0, 10)}</span>
                                        ) : (
                                            <span style={{ color: '#f97316', fontSize: '0.85rem' }}>Processing</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        {!order.isDelivered ? (
                                            <button 
                                                onClick={() => deliverHandler(order._id)}
                                                className="btn-primary"
                                                style={{ padding: '8px 14px', fontSize: '0.75rem', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                                            >
                                                <Truck size={14} /> Deliver
                                            </button>
                                        ) : (
                                            <Link to={`/order/${order._id}`} style={{ color: '#6366f1' }}>
                                                <Eye size={18} />
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showToast && (
                <Toast message={toastMsg} onClose={() => setShowToast(false)} />
            )}
        </div>
    );
};

export default AdminOrderList;