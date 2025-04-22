'use client';

import { Button } from "../../components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "../../components/ui/motion";

export function CartEmpty() {
  const router = useRouter();
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 bg-primary-foreground rounded-full p-6"
        >
          <ShoppingCart className="h-12 w-12 text-primary" />
        </motion.div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          Your cart is empty
        </h1>
        
        <p className="text-muted-foreground mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet. 
          Start shopping and discover amazing products!
        </p>
        
        <motion.div whileTap={{ scale: 0.98 }} className="w-full">
          <Button 
            className="w-full py-6 text-lg" 
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}