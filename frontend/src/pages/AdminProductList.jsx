import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import { Plus, Edit, Trash2, Loader2, PackageSearch } from 'lucide-react';
import Toast from '../components/Toast';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  const navigate = useNavigate();
  
  // Safety Check: Get userInfo
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Relative path works with Local Proxy and Render Domain
      const { data } = await axios.get('/api/products'); 
      setProducts(data);
    } catch (err) {
      triggerToast("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Redirection if user is not an Admin
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    fetchProducts(); 
  }, [navigate, userInfo]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        triggerToast("Product deleted successfully");
        fetchProducts(); // Refresh list after delete
      } catch (err) {
        triggerToast(err.response?.data?.message || "Delete failed");
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      
      const { data } = await axios.post('/api/products', {}, config);
      triggerToast("Sample product created! Redirecting to Editor...");
      
      setTimeout(() => {
          navigate(`/admin/product/${data._id}/edit`);
      }, 1000);
      
    } catch (err) {
      triggerToast(err.response?.data?.message || "Creation failed");
    }
  };

  // If no user/admin, don't render anything to prevent UI flickering
  if (!userInfo || !userInfo.isAdmin) return null;

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <h1 style={{ margin: 0 }}>Product Inventory</h1>
        <button 
          className="btn-primary" 
          onClick={createProductHandler}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', padding: '12px 20px' }}
        >
          <Plus size={18} /> Create New Product
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Loader2 className="animate-spin" size={40} color="var(--accent)" />
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '15px' }}>
          <PackageSearch size={50} color="#cbd5e1" style={{ marginBottom: '15px' }} />
          <p style={{ color: '#64748b' }}>Your inventory is empty. Start by creating a product!</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', overflowX: 'auto', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>ID</th>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>NAME</th>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>PRICE</th>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>CATEGORY</th>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px', fontSize: '0.75rem', color: '#94a3b8' }}>{product._id.substring(0, 8)}...</td>
                  <td style={{ padding: '15px', fontWeight: '600', color: '#1e293b' }}>{product.name}</td>
                  <td style={{ padding: '15px', color: '#1e293b' }}>${product.price.toLocaleString()}</td>
                  <td style={{ padding: '15px', color: '#64748b' }}>{product.category}</td>
                  <td style={{ padding: '15px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link 
                      to={`/admin/product/${product._id}/edit`} 
                      style={{ color: '#6366f1', title: 'Edit Product' }}
                    >
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => deleteHandler(product._id)} 
                      style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default AdminProductList;