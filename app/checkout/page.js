'use client';

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const price = searchParams.get("price");
  const size = searchParams.get("size");
  const img = searchParams.get("img");
  const productId = searchParams.get("productId");
  const productLink = searchParams.get("productLink");

  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      phone: "",
      address: "",
      pincode: "",
    };

    // Name validation
    if (!userDetails.name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    // Phone validation (should be 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!userDetails.phone) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!phoneRegex.test(userDetails.phone)) {
      newErrors.phone = "Phone number should be 10 digits.";
      isValid = false;
    }

    // Address validation
    if (!userDetails.address) {
      newErrors.address = "Address is required.";
      isValid = false;
    }

    // Pincode validation (should be 6 digits)
    const pincodeRegex = /^[0-9]{6}$/;
    if (!userDetails.pincode) {
      newErrors.pincode = "Pincode is required.";
      isValid = false;
    } else if (!pincodeRegex.test(userDetails.pincode)) {
      newErrors.pincode = "Pincode should be 6 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePlaceOrder = () => {
    const { name: userName, phone, address, pincode } = userDetails;

    // Validate the form before submitting
    if (!validateForm()) {
      return;
    }

    const message = `Hello! I would like to place an order:
*Product ID*: ${productId}
*Product*: ${name}
*Price*: ₹${price}
*Size*: ${size}
*Name*: ${userName}
*Phone*: ${phone}
*Address*: ${address}
*Pincode*: ${pincode}
*Product Link*: ${productLink}`;

    const businessPhoneNumber = "6238917427";
    const whatsappURL = `https://wa.me/91${businessPhoneNumber}?text=${encodeURIComponent(message)}`;

    // Check if the device is mobile or desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Open WhatsApp app for mobile devices
      window.open(whatsappURL, "_blank");
    } else {
      // Open WhatsApp Web for desktop devices
      window.open(`https://web.whatsapp.com/send?phone=91${businessPhoneNumber}&text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

        {/* Product Summary */}
        <div className="flex flex-col sm:flex-row gap-6 items-center mb-8">
          <img src={img} alt={name} className="w-28 h-28 object-cover rounded-lg mb-4 sm:mb-0" />
          <div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-gray-600">Size: {size}</p>
            <p className="text-gray-800 font-bold">₹{price}</p>
          </div>
        </div>

        {/* User Details Form */}
        <div className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={userDetails.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={userDetails.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <input
              type="text"
              name="address"
              placeholder="Delivery Address"
              value={userDetails.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={userDetails.pincode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3"
            />
            {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-lg font-semibold transition-colors"
        >
          Place Order via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage; // Ensure this is the default export
