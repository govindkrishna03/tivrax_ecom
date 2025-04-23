"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function OrderSummary({ 
  productName,
  price,
  size,
  image,
  products = [],
  totalPrice,
  quantity = 1 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Prepare display products
  const hasMultipleProducts = products.length > 0;
  const displayProducts = hasMultipleProducts 
    ? products.map(p => ({
        ...p,
        price: Number(p.price) || 0,
        quantity: p.quantity || 1,
        image: p.image || p.img || "/default-product-image.jpg"
      }))
    : [{
        name: productName || "Product",
        price: Number(price) || 0,
        size: size || "N/A", // Default size
        quantity: quantity,
        image: image || "/default-product-image.jpg"
      }];

  const finalTotal = typeof totalPrice === "number" ? totalPrice : displayProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-sm p-6 sticky top-4"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {displayProducts.slice(0, isExpanded ? displayProducts.length : 2).map((product, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
              {product.size && <p className="text-xs text-gray-500">Size: {product.size}</p>}
              <p className="text-xs text-gray-500">Quantity: x{product.quantity}</p>
              <p className="text-sm font-semibold text-gray-900">
                ₹{(product.price * product.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        
        {displayProducts.length > 2 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {isExpanded ? "Show less" : `+ ${displayProducts.length - 2} more item(s)`}
          </button>
        )}
      </div>

      <div className="space-y-2 py-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{finalTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">Included</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}