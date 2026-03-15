import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#666' }}>
        <ArrowLeft size={18} /> Back to Electronics
      </Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginTop: '30px' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '15px' }} />
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>{product.name}</h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--accent)', margin: '20px 0' }}>${product.price}</p>
          <p style={{ lineHeight: '1.6', color: '#555' }}>{product.description}</p>
          <p style={{ marginTop: '20px' }}>
            Status: <strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
          </p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '30px', width: '100%', border: 'none' }}
            disabled={product.countInStock === 0}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={20} /> Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;