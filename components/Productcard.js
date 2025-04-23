'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from './../lib/supabase';
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ id, name, rate, size, image }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
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

  const fetchWishlistItems = async () => {
    if (userId) {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', userId);

      if (!error) {
        setWishlistItems(data || []);
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

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    
    if (!userId) {
      alert('Please login to manage your wishlist');
      return;
    }

    const isInWishlist = wishlistItems.some(item => item.product_id === id);

    if (isInWishlist) {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', id);

      if (!error) {
        fetchWishlistItems();
        showNotification(`${name} removed from wishlist`);
      }
    } else {
      // Add to wishlist
      const { error } = await supabase.from('wishlist').insert([
        {
          user_id: userId,
          product_id: id,
        }
      ]);
      
      if (!error) {
        fetchWishlistItems();
        showNotification(`${name} added to wishlist!`);
      }
    }
  };

  const handleProductClick = () => {
    router.push(`/product/${id}`);
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems();
      fetchWishlistItems();
    }
  }, [userId]);

  if (!id) return null;

  const isInWishlist = wishlistItems.some(item => item.product_id === id);

  return (
    <div
      className="w-full max-w-sm sm:h-[400px] mb-10 bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform transform flex flex-col justify-between relative overflow-hidden"
      onClick={handleProductClick}
    >
      {/* Wishlist button in top-right corner */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all"
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? (
          <FaHeart className="text-red-500 text-xl" />
        ) : (
          <FaRegHeart className="text-gray-600 text-xl hover:text-red-500" />
        )}
      </button>

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