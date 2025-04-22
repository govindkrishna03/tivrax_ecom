'use client';

import { useCart } from './cart-context';
import { CartEmpty } from './cart-empty';
import { CartLoading } from './cart-loading';
import { CartItems } from './cart-items';
import { CartSummary } from './cart-summary';
import { motion } from '../../components/ui/motion';

export function CartContainer() {
  const { loading, cartItems } = useCart();

  if (loading) return <CartLoading />;
  if (cartItems.length === 0) return <CartEmpty />;

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 px-4 sm:px-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItems />
          </div>
          
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </motion.div>
  );
}