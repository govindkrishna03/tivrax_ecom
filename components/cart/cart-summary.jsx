'use client';

import { useCart } from './cart-context';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from '../../components/ui/motion';

export function CartSummary() {
  const { totalAmount, totalItems, cartItems } = useCart(); // include cartItems
  const router = useRouter();
  
  const handleCheckout = () => {
    const encodedProducts = encodeURIComponent(JSON.stringify(cartItems));
    router.push(`/checkout?products=${encodedProducts}`);
  };

  return (
    <Card className="sticky top-4 border-border">
      <CardHeader className="border-b">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items ({totalItems})</span>
            <span>₹{totalAmount.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>Free</span>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span className="text-primary font-bold">₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3">
        <motion.div className="w-full" whileTap={{ scale: 0.98 }}>
          <Button 
            className="w-full py-6 text-lg" 
            onClick={handleCheckout}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Checkout
          </Button>
        </motion.div>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </CardFooter>
    </Card>
  );
}
