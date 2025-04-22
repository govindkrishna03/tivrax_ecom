'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate derived values
  const totalItems = cartItems.length;
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.rate * (item.quantity || 1),
    0
  );

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        let userId = session?.user?.id;
  
        if (!userId) {
          const { data: { user } } = await supabase.auth.getUser();
          userId = user?.id;
        }
  
        if (!userId) {
          setLoading(false);
          return;
        }
  
        const { data: cart, error } = await supabase
          .from('cart')
          .select('id, quantity, size, product_id, products(name, image_url, price)')
          .eq('user_id', userId);
  
        if (error) {
          console.error('Error fetching cart items:', error);
        } else {
          const updatedCart = (cart || []).map(item => ({
            id: item.id,
            product_id: item.product_id,
            size: item.size,
            quantity: item.quantity || 1,
            name: item.products?.name,
            image: item.products?.image_url,
            rate: item.products?.price,
          }));
          setCartItems(updatedCart);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartItems();
  }, []);
  
  const updateItemQuantity = async (id, delta) => {
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

  const navigateToProduct = (id) => {
    window.location.href = `/product/${id}`;
  };

  const checkout = () => {
    alert('Redirecting to CheckOut');
  };

  const value = {
    cartItems,
    loading,
    totalAmount,
    totalItems,
    updateItemQuantity,
    navigateToProduct,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};