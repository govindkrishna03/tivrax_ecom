'use client';
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract product data from URL params
  const productParam = searchParams.get("products");
  const products = productParam ? JSON.parse(decodeURIComponent(productParam)) : [];
  const totalPrice = products.reduce((sum, product) => sum + parseFloat(product.price), 0);

  // Extract individual product details
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
    email: ""
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      phone: "",
      address: "",
      pincode: "",
      email: ""
    };

    if (!userDetails.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!userDetails.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!phoneRegex.test(userDetails.phone.trim())) {
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
    } else if (!pincodeRegex.test(userDetails.pincode.trim())) {
      newErrors.pincode = "Pincode should be 6 digits.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userDetails.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(userDetails.email.trim())) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirmOrder = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method!');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Insert order data into the database
      const { data, error } = await supabase.from('orders').insert([
        {
          product_id: productId,
          product_name: name,
          price: totalPrice,
          size,
          address: userDetails.address,
          phone: userDetails.phone,
          pincode: userDetails.pincode,
          email: userDetails.email,
          user_name: userDetails.name,
          payment_method: paymentMethod,
          payment_status: 'Pending',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      console.log('Order inserted:', data);
      setOrderConfirmed(true);

      // Simulate redirect to a confirmation page after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Error confirming order:', error.message);
      alert('There was a problem confirming your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

        {/* Product Summary */}
        <div className="flex flex-col sm:flex-row gap-6 items-center mb-8">
          <img
            src={img || "/default-product-image.jpg"}
            alt={name || "Product"}
            className="w-28 h-28 object-cover rounded-lg mb-4 sm:mb-0"
          />
          <div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-gray-600">Size: {size}</p>
            <p className="text-gray-800 font-bold">₹{price}</p>
          </div>
        </div>

        {/* User details form */}
        <div className="space-y-4">
          {[
            { name: "name", placeholder: "Your Name", type: "text" },
            { name: "phone", placeholder: "Phone Number", type: "tel" },
            { name: "address", placeholder: "Delivery Address", type: "text" },
            { name: "pincode", placeholder: "Pincode", type: "text" },
            { name: "email", placeholder: "Email Address", type: "email" },
          ].map(({ name, placeholder, type }) => (
            <div key={name}>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={userDetails[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3"
                required
              />
              {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}
        </div>

        {/* Payment Method Selection */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
          {['Cash on Delivery', 'Google Pay', 'PhonePe'].map((method) => (
            <label key={method} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value={method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-blue-600"
                disabled={isSubmitting}
              />
              <span className="text-gray-800">{method}</span>
            </label>
          ))}
        </div>

        {/* Proceed to Payment Button */}
        <button
          onClick={handleConfirmOrder}
          className={`mt-6 w-full ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white py-3 rounded-md text-lg font-semibold transition-all`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Order'}
        </button>
      </div>

      {/* Confirmation Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm mx-auto">
            <h2 className="text-xl font-bold text-yellow-600 mb-2">Confirmation Pending</h2>
            <p className="text-gray-700 mb-4">Your order has been received. We will update the status in your orders tab soon.</p>
            <p className="text-sm text-gray-500">Redirecting you to the homepage...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
