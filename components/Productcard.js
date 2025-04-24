'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from './../lib/supabase';
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
const ProductCard = ({ id, name, rate, discount_rate, size, image, rating }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
      toast.error('Please login to add items to cart');
      return;
    }
  
    const isAlreadyInCart = cartItems.some(
      item => item.product_id === id && item.size === size
    );
  
    if (isAlreadyInCart) {
      toast('Already in your cart!', {
        icon: '🛒',
      });
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
      toast.success(`${name} added to cart!`);
    } else {
      toast.error('Failed to add to cart');
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
      className="w-full max-w-sm bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
      onClick={handleProductClick}
    >
      {/* Product image and wishlist button */}
      <div className="relative">
        <div className="w-full h-48 sm:h-56 p-4 flex justify-center items-center bg-gray-50">
          <img
            className="object-contain w-full h-full transition-all duration-500 group-hover:scale-105"
            src={image}
            alt={name}
            onError={(e) => (e.target.src = '/placeholder.png')}
          />
        </div>
        
        <button
          onClick={(e) => handleWishlistToggle(e)}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? (
            <FaHeart className="text-red-500 text-lg sm:text-xl" />
          ) : (
            <FaRegHeart className="text-gray-500 text-lg sm:text-xl hover:text-red-500" />
          )}
        </button>
      </div>

      {/* Product info */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <span className="text-xs sm:text-sm text-gray-500">Size: {size}</span>
        </div>
        {rating && (

  <div className="flex items-center gap-1 mb-2">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`text-yellow-400 ${i < Math.round(rating) ? '' : 'opacity-30'}`}>
      ★
      </span>
    ))}
<span className="text-sm text-gray-600 ml-1">({rating})</span>
</div>
)}

        <div className="mt-auto">
          {discount_rate ? (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl sm:text-2xl font-bold text-red-600">
                ₹{discount_rate}
              </span>
              <span className="text-sm sm:text-base line-through text-gray-400">
                ₹{rate}
              </span>
              <span className="ml-2 text-xs sm:text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                {Math.round((1 - discount_rate/rate) * 100)}% OFF
              </span>
            </div>
          ) : (
            <span className="text-lg sm:text-xl font-bold text-gray-900 mb-3 block">
              ₹{rate}
            </span>
          )}

          <button
            onClick={(e) => handleAddToCart(e)}
            className="w-full text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <FaShoppingCart className="text-sm" />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;