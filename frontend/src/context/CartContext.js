import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Initialize cartItems from userInfo or direct localStorage
  const [cartItems, setCartItems] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // Fallback chain: userInfo.cartItems -> direct cartItems -> empty array
    return userInfo?.cartItems || JSON.parse(localStorage.getItem('cartItems')) || [];
  });

  // 2. Initialize cart object for Shipping & Payment details
  const [cart, setCart] = useState({
    shippingAddress: localStorage.getItem('shippingAddress') 
      ? JSON.parse(localStorage.getItem('shippingAddress')) 
      : {},
    paymentMethod: localStorage.getItem('paymentMethod') 
      ? JSON.parse(localStorage.getItem('paymentMethod')) 
      : 'PayPal',
  });

  // Sync cartItems to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const savePaymentMethod = (method) => {
    setCart((prev) => ({ ...prev, paymentMethod: method }));
    localStorage.setItem('paymentMethod', JSON.stringify(method));
  };

  const saveShippingAddress = (addressData) => {
    setCart((prev) => ({ ...prev, shippingAddress: addressData }));
    localStorage.setItem('shippingAddress', JSON.stringify(addressData));
  };

  const addToCart = async (product) => {
    // Determine the correct ID to use for comparison
    const productId = product._id || product.product;
    const existItem = cartItems.find((x) => (x.product || x._id) === productId);
    
    let newCart;

    if (existItem) {
      newCart = cartItems.map((x) =>
        (x.product || x._id) === productId
          ? { ...x, qty: x.qty + 1 } 
          : x
      );
    } else {
      newCart = [
        ...cartItems,
        {
          product: productId,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: 1,
        },
      ];
    }

    setCartItems(newCart);

    // Get fresh userInfo inside the function to avoid stale closures
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo && userInfo.token) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        // Using Relative Path for Production
        await axios.put('/api/users/cart', { cartItems: newCart }, config);
        
        const updatedUserInfo = { ...userInfo, cartItems: newCart };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      } catch (error) {
        console.error("Failed to sync cart with database", error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      setCartItems, 
      cart, 
      savePaymentMethod, 
      saveShippingAddress 
    }}>
      {children}
    </CartContext.Provider>
  );
};