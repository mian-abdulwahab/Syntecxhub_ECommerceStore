import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Initialize cartItems from userInfo
  const [cartItems, setCartItems] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo && userInfo.cartItems ? userInfo.cartItems : [];
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

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUser && storedUser.cartItems) {
      setCartItems(storedUser.cartItems);
    } else {
      setCartItems([]);
    }
  }, []);

  // Function to save Payment Method globally
  const savePaymentMethod = (method) => {
    setCart((prev) => ({ ...prev, paymentMethod: method }));
    localStorage.setItem('paymentMethod', JSON.stringify(method));
  };

  // Function to save Shipping Address globally
  const saveShippingAddress = (addressData) => {
    setCart((prev) => ({ ...prev, shippingAddress: addressData }));
    localStorage.setItem('shippingAddress', JSON.stringify(addressData));
  };

  const addToCart = async (product) => {
    const existItem = cartItems.find((x) => x.product === (product._id || product.product));
    let newCart;

    if (existItem) {
      newCart = cartItems.map((x) =>
        x.product === (product._id || product.product) 
          ? { ...x, qty: x.qty + 1 } 
          : x
      );
    } else {
      newCart = [
        ...cartItems,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: 1,
        },
      ];
    }

    setCartItems(newCart);

    if (userInfo) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        // Using Proxy URL
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