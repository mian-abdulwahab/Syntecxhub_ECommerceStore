import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductEditScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: '', price: 0, image: '', category: '', countInStock: 0, description: ''
    });

    // Safety Check: Get userInfo and ensure user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        // Redirection logic if not an admin or not logged in
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }

        const fetchProduct = async () => {
            try {
                // FIX: Removed localhost:5000
                const { data } = await axios.get(`/api/products/${id}`);
                setProductData(data);
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };
        fetchProduct();
    }, [id, navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}` 
                }
            };

            // FIX: Removed localhost:5000
            await axios.put(`/api/products/${id}`, productData, config);
            
            alert('Product Updated Successfully!');
            navigate('/admin/productlist');
        } catch (err) {
            const message = err.response?.data?.message || 'Update failed';
            alert(message);
        }
    };

    return (
        <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
            <form onSubmit={submitHandler} className="product-card" style={{ padding: '30px', maxWidth: '600px', margin: 'auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Edit Product</h2>
                
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Product Name</label>
                <input 
                    type="text" placeholder="Name" value={productData.name} 
                    onChange={(e) => setProductData({...productData, name: e.target.value})} 
                />

                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Price ($)</label>
                <input 
                    type="number" placeholder="Price" value={productData.price} 
                    onChange={(e) => setProductData({...productData, price: e.target.value})} 
                />

                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Image URL</label>
                <input 
                    type="text" placeholder="Image URL" value={productData.image} 
                    onChange={(e) => setProductData({...productData, image: e.target.value})} 
                />

                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Stock Quantity</label>
                <input 
                    type="number" placeholder="Stock" value={productData.countInStock} 
                    onChange={(e) => setProductData({...productData, countInStock: e.target.value})} 
                />

                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Description</label>
                <textarea 
                    placeholder="Description" 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                    value={productData.description} 
                    onChange={(e) => setProductData({...productData, description: e.target.value})}
                ></textarea>

                <button type="submit" className="btn-primary" style={{ marginTop: '20px', width: '100%', border: 'none' }}>
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default ProductEditScreen;