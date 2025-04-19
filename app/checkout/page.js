'use client';

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    size: "",
    img: "",
    productId: "",
    productLink: ""
  });

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

  useEffect(() => {
    // To avoid hydration mismatch, we set values in client-side useEffect
    setProductData({
      name: searchParams.get("name") || "",
      price: searchParams.get("price") || "",
      size: searchParams.get("size") || "",
      img: searchParams.get("img") || "",
      productId: searchParams.get("productId") || "",
      productLink: searchParams.get("productLink") || "",
    });
  }, [searchParams]);

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

    if (!userDetails.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!userDetails.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!phoneRegex.test(userDetails.phone)) {
      newErrors.phone = "Phone number should be 10 digits.";
      isValid = false;
    }

    if (!userDetails.address.trim()) {
      newErrors.address = "Address is required.";
      isValid = false;
    }

    const pincodeRegex = /^[0-9]{6}$/;
    if (!userDetails.pincode.trim()) {
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
    const { name, price, size, img, productId, productLink } = productData;
    const { name: userName, phone, address, pincode } = userDetails;

    if (!validateForm()) return;

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
    const encodedMessage = encodeURIComponent(message);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const whatsappURL = isMobile
      ? `https://wa.me/91${businessPhoneNumber}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=91${businessPhoneNumber}&text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  const { name, price, size, img } = productData;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

        <div className="flex flex-col sm:flex-row gap-6 items-center mb-8">
          <img src={img} alt={name} className="w-28 h-28 object-cover rounded-lg" />
          <div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-gray-600">Size: {size}</p>
            <p className="text-gray-800 font-bold">₹{price}</p>
          </div>
        </div>

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

export default CheckoutPage;
