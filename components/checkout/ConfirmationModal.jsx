"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmationModal({ 
  orderId, 
  paymentMethod,
  onClose,
  autoRedirect = true
}) {
  const [countdown, setCountdown] = useState(5);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!autoRedirect) return;

    const timer = countdown > 0 
      ? setTimeout(() => setCountdown(countdown - 1), 1000)
      : null;
    
    return () => timer && clearTimeout(timer);
  }, [countdown, autoRedirect]);

  useEffect(() => {
    if (autoRedirect && countdown === 0 && !isClosing) {
      setIsClosing(true);
      setTimeout(() => {
        window.location.href = '/orders';
      }, 500);
    }
  }, [countdown, autoRedirect, isClosing]);

  const getPaymentMethodName = () => {
    const methods = {
      cod: "Cash on Delivery",
      gpay: "Google Pay",
      phonepe: "PhonePe"
    };
    return methods[paymentMethod] || paymentMethod;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 500);
  };

  const renderPaymentAnimation = () => {
    switch(paymentMethod) {
      case "gpay":
        return (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 15,
              repeat: 1,
              repeatType: "mirror"
            }}
            className="w-16 h-16 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center"
          >
            <div className="relative w-10 h-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute w-full h-2 bg-blue-500 rounded-full top-1"
              />
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute w-2 h-full bg-blue-500 rounded-full right-1"
              />
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute w-2 h-full bg-blue-500 rounded-full left-1"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute w-full h-2 bg-blue-500 rounded-full bottom-1"
              />
            </div>
          </motion.div>
        );
      
      case "phonepe":
        return (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 10,
              repeat: 1,
              repeatType: "reverse"
            }}
            className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-purple-600"
            >
              P
            </motion.div>
          </motion.div>
        );
      
      default:
        return (
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
              className="text-2xl"
            >
              ✓
            </motion.span>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden"
          >
            <div className="p-6">
              <div className="mb-4 flex justify-center">
                {renderPaymentAnimation()}
              </div>
              
              <motion.h2 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-center text-gray-900 mb-1"
              >
                {paymentMethod === "cod" 
                  ? "Order Confirmed!" 
                  : paymentMethod === "gpay"
                    ? "Google Pay Processing"
                    : "PhonePe Payment Started"}
              </motion.h2>
              
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-gray-600 mb-6"
              >
                {paymentMethod === "cod" 
                  ? "Thank you for your purchase!" 
                  : "Please complete payment in the next step"}
              </motion.p>
              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 p-4 rounded-lg mb-6"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{getPaymentMethodName()}</span>
                </div>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-center text-gray-500 mb-4"
              >
                {autoRedirect 
                  ? `Redirecting to orders in ${countdown} seconds...`
                  : "You can view your order in your account"}
              </motion.p>

              {!autoRedirect && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Order
                </motion.button>
              )}
            </div>
            
            {autoRedirect && (
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-1 bg-green-500 origin-left"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}