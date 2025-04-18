'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the styles

const ProductCard = ({ id, name, rate, size, image }) => {
  const router = useRouter();  // For navigation on click

  const handleAddToCart = () => {
    const newProduct = { id, name, rate, size, image };
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const isAlreadyInCart = existingCart.some(item => item.id === id);
    if (!isAlreadyInCart) {
      const updatedCart = [...existingCart, newProduct];
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      // Show a custom success toast notification
      toast.success('Added to cart!', {
        position: "top-center",
        autoClose: 3000,  // Toast disappears after 3 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } else {
      // Show a custom warning toast notification
      toast.warn('Already in cart!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleProductClick = () => {
    router.push(`/product/${id}`);
  };

  if (!id) return null;

  return (
    <div
      className="w-full max-w-sm h-[400px] mb-10 bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform transform flex flex-col justify-between relative overflow-hidden"
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="w-full h-48 p-5 flex justify-center items-center">
        <img
          className="object-contain max-w-full max-h-full transition-all duration-300 transform hover:scale-110"
          src={image}
          alt={name}
        />
      </div>

      {/* Product Details */}
      <div className="px-5 pb-5 flex flex-col items-center justify-center z-10">
        <h3 className="text-xl font-semibold text-black text-center cursor-pointer hover:underline">
          {name}
        </h3>
        <span className="text-sm text-gray-600 mb-1">Size: {size}</span>
        <span className="text-3xl font-bold text-black p-2 mb-3">
          ₹{rate}
        </span>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();  // Prevent triggering the product click event
            handleAddToCart();
          }}
          className="w-[50%] text-white bg-black transform hover:scale-110 transition-all duration-300 font-medium rounded-4xl text-sm px-5 py-2.5 mt-3 shadow-md hover:shadow-lg"
        >
          Add to cart
        </button>
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default ProductCard;
