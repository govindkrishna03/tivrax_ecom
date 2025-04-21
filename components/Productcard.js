'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from './../lib/supabase';

const ProductCard = ({ id, name, rate, size, image }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Subscribe to authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCartItems();
      fetchWishlistItems();
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [userId]);

  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching cart:", error.message);
    } else {
      setCartItems(data || []);
    }
  };

  const fetchWishlistItems = async () => {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching wishlist:", error.message);
    } else {
      setWishlistItems(data || []);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!userId) {
      toast.error('You must be logged in to add items to the cart');
      return;
    }

    const isAlreadyInCart = cartItems.some(item => item.product_id === id);
    
    if (!isAlreadyInCart) {
      const { error } = await supabase
        .from('cart')
        .insert([{ 
          product_id: id,
          name,
          rate,
          size,
          image,
          user_id: userId
        }]);

      if (error) {
        toast.error('Error adding to cart!');
        console.error('Error adding to cart:', error.message);
      } else {
        fetchCartItems();
        toast.success('Added to cart!');
      }
    } else {
      toast.warn('Already in cart!');
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    
    if (!userId) {
      toast.error('You must be logged in to add items to wishlist');
      return;
    }

    const isAlreadyInWishlist = wishlistItems.some(item => item.product_id === id);
    
    if (!isAlreadyInWishlist) {
      const { error } = await supabase
        .from('wishlist')
        .insert([{ 
          user_id: userId,
          product_id: id,
          name,
          rate,
          size,
          image
        }]);

      if (error) {
        toast.error('Error adding to wishlist!');
        console.error('Error adding to wishlist:', error.message);
      } else {
        fetchWishlistItems();
        toast.success('Added to wishlist!');
      }
    } else {
      toast.warn('Already in wishlist!');
    }
  };

  const handleProductClick = () => {
    router.push(`/product/${id}`);
  };

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

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="text-white bg-black transform hover:scale-110 transition-all duration-300 font-medium rounded-4xl text-sm px-5 py-2.5 mt-3 shadow-md hover:shadow-lg"
          >
            Add to cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="text-black bg-gray-100 transform hover:scale-110 transition-all duration-300 font-medium rounded-4xl text-sm px-5 py-2.5 mt-3 shadow-md hover:shadow-lg"
          >
            ♡ Wishlist
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        newestOnTop
      />
    </div>
  );
};

export default ProductCard;