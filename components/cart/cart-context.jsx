'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
// Add inside CartProvider, below fetchCartItems
const refreshCart = () => {
  fetchCartItems(); // reuse the same function
};

  // Calculate derived values
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
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
          .select('id, quantity, size, product_id, products(name, image_url, price,discounted_price)')
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
            rate: item.products?.discounted_price ?? item.products?.price, // 👈 fallback to price
            originalPrice: item.products?.price,
            discountedPrice: item.products?.discounted_price,
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
    router.push(`/product/${id}`);
  };
  const updateItemSize = (id, newSize) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, size: newSize } : item
      )
    );
  };
  
  const checkout = () => {
    // Prepare products data for checkout
    const productsData = cartItems.map(item => ({
      productId: item.product_id,
      name: item.name,
      price: item.rate,
      size: item.size,
      image: item.image,
      quantity: item.quantity,
      productLink: `/product/${item.product_id}`
    }));

    // Navigate to checkout with all products
    router.push(`/checkout?products=${encodeURIComponent(JSON.stringify(productsData))}`);
  };

  const value = {
    cartItems,
    loading,
    totalAmount,
    totalItems,
    updateItemQuantity,
    navigateToProduct,
    checkout,
    updateItemSize, // 👈 add this
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