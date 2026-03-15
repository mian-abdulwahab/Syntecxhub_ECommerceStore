import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShippingScreen = () => {
  // Pull existing address if it exists
  const [address, setAddress] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).address : '');
  const [city, setCity] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).city : '');
  const [postalCode, setPostalCode] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).postalCode : '');
  const [country, setCountry] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).country : '');

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
    navigate('/payment'); // Move to the next step
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <form onSubmit={submitHandler} className="product-card" style={{ padding: '40px', width: '500px' }}>
        <h2 style={{ marginBottom: '20px' }}>Shipping Details</h2>
        
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
        <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px', border: 'none' }}>
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default ShippingScreen;