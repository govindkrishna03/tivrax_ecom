"use client";

import { motion } from "framer-motion";

export default function CheckoutSteps({ currentStep }) {
  const steps = [
    { number: 1, title: "Shipping" },
    { number: 2, title: "Payment" },
  ];

  return (
    <div className="py-4">
      <div className="flex items-center justify-center md:justify-start">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  backgroundColor: currentStep >= step.number ? "rgb(34, 197, 94)" : "rgb(229, 231, 235)"
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center w-10 h-10 rounded-full text-white font-medium"
              >
                {currentStep > step.number ? "✓" : step.number}
              </motion.div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{step.title}</p>
            </div>
            
            {index < steps.length - 1 && (
              <div className="ml-3 mr-3">
                <div className={`w-16 h-1 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}