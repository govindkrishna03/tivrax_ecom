'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        let userId = session?.user?.id;

        if (!userId) {
          const { data: { user } } = await supabase.auth.getUser();
          userId = user?.id;
        }

        if (!userId) return setLoading(false);

        const { data: cart, error } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', userId);

        if (error) console.error('Error fetching cart items:', error);
        setCartItems(cart || []);
      } catch (err) {
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };

    getCartItems();
  }, []);

  const handleQuantityChange = async (id, delta) => {
    const currentItem = cartItems.find(item => item.id === id);
  
    if (!currentItem) return;
  
    const newQty = (currentItem.quantity || 1) + delta;
  
    if (newQty <= 0) {
      const { error } = await supabase.from('cart').delete().eq('id', id);
      if (!error) {
        setCartItems(cartItems.filter(item => item.id !== id));
      }
    } else {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQty })
        .eq('id', id);
  
      if (!error) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, quantity: newQty } : item
          )
        );
      }
    }
  };
  

  const handleProductClick = (id) => router.push(`/product/${id}`);
  const handleBuyAll = () => {
    alert('Redirect to payment or WhatsApp with full cart');
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.rate * (item.quantity || 1),
    0
  );

  const LoadingUI = () => (
    <div className="h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mb-4" />
      <p className="text-lg text-gray-500">Loading cart...</p>
    </div>
  );

  if (loading) return <LoadingUI />;

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
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Your Shopping Cart</h1>

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border"
          >
            <div
              onClick={() => handleProductClick(item.product_id)}
              className="flex items-center gap-6 cursor-pointer w-full sm:w-auto"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-lg border"
              />
              <div>
                <p className="font-semibold text-xl text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                <p className="text-lg font-bold text-green-600 mt-2">₹{item.rate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(item.id, -1)}
                className="text-xl w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-800"
              >
                -
              </button>
              <span className="font-semibold text-lg text-gray-800">
                {item.quantity || 1}
              </span>
              <button
                onClick={() => handleQuantityChange(item.id, 1)}
                className="text-xl w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-800"
              >
                +
              </button>
            </div>
          </div>
        ))}

        {/* Summary Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border">
          <div>
            <p className="text-xl text-gray-800 font-medium">
              Total Items: <span className="font-bold">{cartItems.length}</span>
            </p>
            <p className="text-xl text-gray-800 font-medium mt-1">
              Total Amount:{' '}
              <span className="font-bold text-green-600">₹{totalAmount}</span>
            </p>
          </div>

          <button
            onClick={handleBuyAll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg transition"
          >
            Buy All
          </button>
        </div>
      </div>
    </div>
  );
}
