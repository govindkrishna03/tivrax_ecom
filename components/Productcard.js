'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from './../lib/supabase';

const ProductCard = ({ id, name, rate, size, image }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const fetchCartItems = async () => {
    if (userId) {
      const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId);

      if (!error) {
        setCartItems(data || []);
      }
    }
  };

  const showNotification = (message) => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      // Request permission if not already granted
      if (Notification.permission === 'granted') {
        new Notification(message);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(message);
          }
        });
      }
    }
    
    // Fallback to alert if notifications not supported
    if (!('Notification' in window)) {
      alert(message);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!userId) {
      alert('Please login to add items to cart');
      return;
    }

    const newProduct = {
      product_id: id,
      name,
      rate,
      size,
      image,
      user_id: userId,
      quantity: 1
    };

    const isAlreadyInCart = cartItems.some(item => item.product_id === id);

    if (!isAlreadyInCart) {
      const { error } = await supabase.from('cart').insert([newProduct]);

      if (!error) {
        fetchCartItems();
        showNotification(`${name} added to cart successfully!`);
      } else {
        console.log('Error adding item to cart:', error.message);
      }
    } else {
      showNotification(`${name} is already in your cart`);
    }
  };

  const handleProductClick = () => {
    router.push(`/product/${id}`);
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  if (!id) return null;

  return (
    <div
      className="w-full max-w-sm sm:h-[400px] mb-10 bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform transform flex flex-col justify-between relative overflow-hidden"
      onClick={handleProductClick}
    >
      <div className="w-full h-48 p-5 flex justify-center items-center">
        <img
          className="object-contain max-w-full max-h-full transition-all duration-300 transform hover:scale-110"
          src={image}
          alt={name}
          onError={(e) => e.target.src = '/placeholder-product.png'}
        />
      </div>

      <div className="px-5 pb-5 flex flex-col items-center justify-center z-10">
        <h3 className="text-sm sm:text-xl font-semibold text-black text-center cursor-pointer hover:underline">
          {name}
        </h3>
        <span className="text-sm text-gray-600 mb-1">Size: {size}</span>
        <span className="text-xl sm:text-3xl font-bold text-black mb-2">
          ₹{rate}
        </span>

        <button
          onClick={handleAddToCart}
          className="sm:w-[50%] text-white bg-black transform hover:scale-110 transition-all duration-300 font-medium rounded-4xl text-sm px-5 py-2.5 mt-3 shadow-md hover:shadow-lg"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;