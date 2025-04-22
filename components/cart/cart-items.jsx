'use client';

import { useCart } from './cart-context';
import { CartItemCard } from './cart-item-card';
import { motion } from '../../components/ui/motion';

export function CartItems() {
  const { cartItems } = useCart();

  return (
    <div className="space-y-4">
      {cartItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.05,
            ease: "easeOut" 
          }}
        >
          <CartItemCard item={item} />
        </motion.div>
      ))}
    </div>
  );
}