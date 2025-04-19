'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles
import { supabase } from './../lib/supabase'; // Import Supabase client

const ProductCard = ({ id, name, rate, size, image }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null); // Store user ID
  const router = useRouter(); // For navigation on click

  useEffect(() => {
    // Subscribe to authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id); // Set user ID from session
      } else {
        setUserId(null); // No user logged in
      }
    });

    // Clean up the listener on component unmount
    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();  // Correct way to unsubscribe
      }
    };
  }, []);

  // Fetch cart items from Supabase
  const fetchCartItems = async () => {
    if (userId) {
      const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error("Error fetching cart:", error.message);
      } else {
        setCartItems(data || []);
      }
    }
  };

 // Handle adding product to cart
const handleAddToCart = async () => {
  if (!userId) {
    toast.error('You must be logged in to add items to the cart');
    return;
  }
  const newProduct = { 
    product_id: id, // change from `id` to `product_id`
    name, 
    rate, 
    size, 
    image,
    user_id: userId 
  };
  
  // Check if the product is already in the cart
  const isAlreadyInCart = cartItems.some(item => item.id === id);

  if (!isAlreadyInCart) {
    const { error } = await supabase
    .from('cart')
    .insert([newProduct]);
  

    if (error) {
      toast.error('Error adding to cart!');
      console.error('Error adding to cart:', error.message);
    } else {
      fetchCartItems(); // Refresh cart state
      toast.success('Added to cart!');
    }
  } else {
    toast.warn('Already in cart!');
  }
};


  const handleProductClick = () => {
    router.push(`/product/${id}`);
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems(); // Fetch cart items after user ID is set
    }
  }, [userId]);

  if (!id) return null;

  return (
    <div
      className="w-full max-w-sm sm:h-[400px] mb-10 bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform transform flex flex-col justify-between relative overflow-hidden"
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="w-full h-48 p-5 flex justify-center items-center">
        <img
          className="object-contain max-w-full max-h-full transition-all duration-300 transform hover:scale-110"
          src={image}
          alt={name}
        />
      </div>

      {/* Product Details */}
      <div className="px-5 pb-5 flex flex-col items-center justify-center z-10">
        <h3 className="text-sm sm:text-xl font-semibold text-black text-center cursor-pointer hover:underline">
          {name}
        </h3>
        <span className="text-sm text-gray-600 mb-1">Size: {size}</span>
        <span className="text-xl sm:text-3xl font-bold text-black mb-2">
          ₹{rate}
        </span>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the product click event
            handleAddToCart();
          }}
          className="sm:w-[50%] text-white bg-black transform hover:scale-110 transition-all duration-300 font-medium rounded-4xl text-sm px-5 py-2.5 mt-3 shadow-md hover:shadow-lg"
        >
          Add to cart
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default ProductCard;
