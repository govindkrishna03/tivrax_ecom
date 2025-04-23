"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmationModal({ orderId, paymentMethod }) {
  const [countdown, setCountdown] = useState(5); // Countdown timer
  const [isRedirecting, setIsRedirecting] = useState(false); // To control redirect effect

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isRedirecting) {
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.href = '/'; // Redirect to homepage after 5 seconds
      }, 1000);
    }
  }, [countdown, isRedirecting]);

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case "cod": return "Cash on Delivery";
      case "gpay": return "Google Pay";
      case "phonepe": return "PhonePe";
      default: return paymentMethod;
    }
  };

  const getAdditionalMessage = () => {
    if (paymentMethod === "gpay" || paymentMethod === "phonepe") {
      return "Confirmation Pending. Will be updated within 24 hrs.";
    }
    return `Redirecting to homepage in ${countdown} seconds...`;
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden"
        >
          <div className="p-6">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
            
            <motion.h2 
  initial={{ y: 10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.3 }}
  className="text-xl font-bold text-center text-gray-900 mb-1"
>
  {paymentMethod === "COD" ? "Order Confirmed!" : "Confirmation Pending"}
</motion.h2>

            
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-gray-600 mb-6"
            > {paymentMethod === "COD"}
              Thank you for your purchase
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
              className="text-sm text-center text-gray-500"
            >
              {getAdditionalMessage()}
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-1 bg-green-500 origin-left"
          ></motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
