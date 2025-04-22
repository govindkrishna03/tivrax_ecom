'use client';

import { useState, useEffect } from 'react';
import { useCart } from './cart-context';
import { supabase } from '../../lib/supabase'; // make sure you have your client setup
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { PlusIcon, MinusIcon } from 'lucide-react';
import { motion } from '../../components/ui/motion';
export function CartItemCard({ item }) {
  const { updateItemQuantity, navigateToProduct } = useCart();
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(item.size || 'Standard');
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get the current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return; // 🛑 Wait until userId is set
  
    const fetchSizes = async () => {
      const { data, error } = await supabase
        .from('cart')
        .select('size')
        .eq('product_id', item.product_id)
        .eq('user_id', userId);
  
      if (!error && data) {
        const uniqueSizes = [...new Set(data.map(item => item.size))]
        .flatMap(size => size.split(',')) // 👈 split comma-separated values
        .map(size => size.trim())         // 👈 remove spaces
        .filter(Boolean)                  // 👈 remove empty strings
        .filter((value, index, self) => self.indexOf(value) === index) // 👈 remove duplicates
        .map(size => ({ size }));
      
        setAvailableSizes(uniqueSizes);
      } else {
        console.error('Error fetching sizes:', error?.message);
      }
    };
  
    fetchSizes();
  }, [item.product_id, userId]);

  const handleSizeChange = async (newSize) => {
    setSelectedSize(newSize);
    setIsSizeModalOpen(false);

    const { error } = await supabase
      .from('cart')
      .update({ size: newSize })
      .eq('id', item.id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating size:', error.message);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row w-full">
          <div 
            className="w-full sm:w-1/3 h-40 sm:h-auto cursor-pointer overflow-hidden"
            onClick={() => navigateToProduct(item.product_id)}
          >
            <motion.img
              src={item.image || 'https://placehold.co/400x400/e2e8f0/1e293b?text=Product'}
              alt={item.name || 'Product'}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                e.target.src = 'https://placehold.co/400x400/e2e8f0/1e293b?text=Product';
              }}
            />
          </div>

          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div 
                className="cursor-pointer"
                onClick={() => navigateToProduct(item.product_id)}
              >
                <h3 className="text-xl font-semibold text-gray-800 hover:text-primary transition-colors duration-200">
                  {item.name || 'Product Name'}
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  Size: {selectedSize}
                </p>
              </div>

              <p className="text-lg font-medium text-primary mt-2">
                ₹{item.rate?.toLocaleString() || '0.00'}
              </p>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => updateItemQuantity(item.id, -1)}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>

                <span className="w-10 inline-flex justify-center font-medium">
                  {item.quantity || 1}
                </span>

                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => updateItemQuantity(item.id, 1)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-lg font-bold text-foreground">
                ₹{((item.rate || 0) * (item.quantity || 1)).toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
  Size: {selectedSize}
</p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsSizeModalOpen(true)}
            >
              Select Size
            </Button>
              
            {isSizeModalOpen && (
              <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-4">Select Size</h3>
                  <div className="space-y-2">
                    {availableSizes.map(({ size }, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleSizeChange(size)}
                        className="w-full"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsSizeModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
