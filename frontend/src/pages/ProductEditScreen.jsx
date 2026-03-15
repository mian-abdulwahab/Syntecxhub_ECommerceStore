import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductEditScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: '', price: 0, image: '', category: '', countInStock: 0, description: ''
    });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
            setProductData(data);
        };
        fetchProduct();
    }, [id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/products/${id}`, productData, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            alert('Product Updated!');
            navigate('/admin/productlist');
        } catch (err) {
            alert('Update failed');
        }
    };

    return (
        <div className="container" style={{ marginTop: '40px' }}>
            <form onSubmit={submitHandler} className="product-card" style={{ padding: '30px', maxWidth: '600px', margin: 'auto' }}>
                <h2>Edit Product</h2>
                <input 
                    type="text" placeholder="Name" value={productData.name} 
                    onChange={(e) => setProductData({...productData, name: e.target.value})} 
                />
                <input 
                    type="number" placeholder="Price" value={productData.price} 
                    onChange={(e) => setProductData({...productData, price: e.target.value})} 
                />
                <input 
                    type="text" placeholder="Image URL" value={productData.image} 
                    onChange={(e) => setProductData({...productData, image: e.target.value})} 
                />
                <input 
                    type="number" placeholder="Stock" value={productData.countInStock} 
                    onChange={(e) => setProductData({...productData, countInStock: e.target.value})} 
                />
                <textarea 
                    placeholder="Description" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                    value={productData.description} 
                    onChange={(e) => setProductData({...productData, description: e.target.value})}
                ></textarea>
                <button type="submit" className="btn-primary" style={{ marginTop: '20px', width: '100%' }}>Update Product</button>
            </form>
        </div>
    );
};

export default ProductEditScreen;