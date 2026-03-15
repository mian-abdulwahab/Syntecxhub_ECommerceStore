import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import { Plus, Edit, Trash2 } from 'lucide-react';
import Toast from '../components/Toast'; // Added Toast import

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products'); // Cleaned up URL
      setProducts(data);
    } catch (err) {
      triggerToast("Failed to fetch products");
    }
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  // Helper to trigger Toast
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  // DELETE HANDLER
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        triggerToast("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        triggerToast(err.response?.data?.message || "Delete failed");
      }
    }
  };

  // CREATE PRODUCT HANDLER
  const createProductHandler = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      
      const { data } = await axios.post('/api/products', {}, config);
      
      triggerToast("Sample product created! Redirecting...");
      
      setTimeout(() => {
          navigate(`/admin/product/${data._id}/edit`);
      }, 1000);
      
    } catch (err) {
      triggerToast(err.response?.data?.message || "Creation failed");
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Manage Products</h1>
        <button 
          className="btn-primary" 
          onClick={createProductHandler}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none' }}
        >
          <Plus size={18} /> Create Product
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <thead style={{ background: '#f8fafc', textAlign: 'left' }}>
          <tr>
            <th style={{ padding: '15px', color: '#64748b' }}>ID</th>
            <th style={{ padding: '15px', color: '#64748b' }}>NAME</th>
            <th style={{ padding: '15px', color: '#64748b' }}>PRICE</th>
            <th style={{ padding: '15px', color: '#64748b' }}>CATEGORY</th>
            <th style={{ padding: '15px', color: '#64748b' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '15px', fontSize: '0.75rem', color: '#94a3b8' }}>{product._id}</td>
              <td style={{ padding: '15px', fontWeight: '600', color: '#1e293b' }}>{product.name}</td>
              <td style={{ padding: '15px', color: '#1e293b' }}>${product.price.toLocaleString()}</td>
              <td style={{ padding: '15px', color: '#64748b' }}>{product.category}</td>
              <td style={{ padding: '15px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                
                <Link 
                  to={`/admin/product/${product._id}/edit`} 
                  style={{ color: '#6366f1', display: 'flex', alignItems: 'center' }}
                >
                  <Edit size={18} />
                </Link>

                <button 
                  onClick={() => deleteHandler(product._id)} 
                  style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Toast Notification */}
      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default AdminProductList;