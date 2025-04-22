'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from './../lib/supabase';

const ProductCard = ({ id, name, rate, size, image }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
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
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(message);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(message);
          }
        });
      }
    } else {
      alert(message);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
  
    if (!userId) {
      alert('Please login to add items to cart');
      return;
    }
  
    // Debugging the size value
    console.log('Selected size:', size);
  
    const isAlreadyInCart = cartItems.some(
      item => item.product_id === id && item.size === size
    );
  
    if (isAlreadyInCart) {
      showNotification(`${name} (Size ${size}) is already in your cart`);
      return;
    }
  
    const { error } = await supabase.from('cart').insert([
      {
        user_id: userId,
        product_id: id,
        size: size,
        quantity: 1,
      }
    ]);
    
    if (!error) {
      fetchCartItems();
      showNotification(`${name} (Size ${size}) added to cart successfully!`);
    } else {
      console.error('Error adding to cart:', error.message);
    }
    
  };
  
  const handleProductClick = () => {
    router.push(`/product/${id}`);
  };

  useEffect(() => {
    if (userId) fetchCartItems();
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
          onError={(e) => e.target.src = '/placeholder.png'}
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
