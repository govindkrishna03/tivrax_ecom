"use client";

import { motion } from "framer-motion";

export default function CheckoutSteps({ currentStep, steps = [] }) {
  const defaultSteps = [
    { number: 1, title: "Shipping" },
    { number: 2, title: "Payment" },
    { number: 3, title: "Confirmation" }
  ];

  const activeSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="py-6 px-4 bg-white rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6">
        {activeSteps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  backgroundColor: currentStep >= step.number ? "rgb(34, 197, 94)" : "rgb(229, 231, 235)",
                  color: currentStep >= step.number ? "white" : "gray"
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center w-10 h-10 rounded-full font-medium"
              >
                {currentStep > step.number ? "✓" : step.number}
              </motion.div>
              {currentStep === step.number && (
                <motion.div
                  layoutId="activeStep"
                  className="absolute inset-0 border-2 border-green-500 rounded-full pointer-events-none"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </div>
            <div className="ml-2">
              <p className={`text-sm font-medium ${
                currentStep >= step.number ? "text-gray-900" : "text-gray-500"
              }`}>
                {step.title}
              </p>
            </div>
            
            {index < activeSteps.length - 1 && (
              <div className="ml-3 mr-3">
                <div className={`w-8 h-1 ${
                  currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}