'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch cart items
  useEffect(() => {
    const getCartItems = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Session from getSession:', session);
        if (sessionError) console.error('Session error:', sessionError);

        let userId = session?.user?.id;

        // Fallback if session is null
        if (!userId) {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          console.log('Fallback user:', user);
          if (userError) console.error('User fetch error:', userError);
          userId = user?.id;
        }

        if (!userId) {
          console.warn('No user session found.');
          setLoading(false);
          return;
        }

        const { data: cart, error: cartError } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', userId);

        if (cartError) {
          console.error('Error fetching cart items:', cartError);
        } else {
          console.log('Fetched cart items:', cart);
          setCartItems(cart || []);
        }
      } catch (err) {
        console.error('Unexpected error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };

    getCartItems();
  }, []);

  const handleRemove = async (id) => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error('Error removing item:', error);
    } else {
      const updatedCart = cartItems.filter(item => item.id !== id);
      setCartItems(updatedCart);
    }
  };
  
  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-lg text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <img
          src="/icons/cart.png"
          alt="Empty Cart"
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain mb-6"
        />
        <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">
          Your Shopping Cart
        </h1>
        <p className="text-center text-lg text-gray-500">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div
              onClick={() => handleProductClick(item.product_id)}
              className="flex items-center gap-6 cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-contain rounded-lg"
              />
              <div>
                <p className="font-semibold text-xl text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                <p className="text-lg font-bold text-green-600 mt-2">₹{item.rate}</p>
              </div>
            </div>

            <button
              onClick={() => handleRemove(item.id)}
              className="self-start sm:self-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
