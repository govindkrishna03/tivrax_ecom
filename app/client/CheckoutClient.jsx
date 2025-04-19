'use client';
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from '../../lib/supabase'; // Ensure the supabase client is correctly initialized

const CheckoutClient = () => {
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
    email: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      if (data) {
        setUserDetails((prev) => ({
          ...prev,
          name: data.user.user_metadata?.full_name || "",
          email: data.user.email || "",
        }));
      }
    };

    fetchUserData();
  }, []);

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

    if (!userDetails.name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!userDetails.phone) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!phoneRegex.test(userDetails.phone)) {
      newErrors.phone = "Phone number should be 10 digits.";
      isValid = false;
    }

    if (!userDetails.address) {
      newErrors.address = "Address is required.";
      isValid = false;
    }

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

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const { name: userName, phone, address, pincode } = userDetails;
    const { data: user, error: userError } = await supabase.auth.getUser();
if (userError) {
  console.error("Error fetching user:", userError.message);
  return;
}

    const orderData = {
      product_id: productId,
      product_name: name,
      price: parseFloat(price),
      size: size,
      address: address,
      phone: phone,
      pincode: pincode,
      user_id: user?.id,
      created_at: new Date(),
    };

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) {
        console.error('Error inserting order:', error.message);
        alert('An error occurred while placing the order.');
        return;
      }

      console.log('Order placed successfully', data);
      alert('Your order has been placed successfully!');
      // Optionally, reset the form or redirect to a confirmation page
      setUserDetails({
        name: "",
        phone: "",
        address: "",
        pincode: "",
        email: "",
      });
    } catch (err) {
      console.error('Error placing order:', err.message);
      alert('An error occurred while placing the order.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

        <div className="flex flex-col sm:flex-row gap-6 items-center mb-8">
          <img
            src={img || "/default-product-image.jpg"}  // Use a default image if none is provided
            alt={name || "Product"}
            className="w-28 h-28 object-cover rounded-lg mb-4 sm:mb-0"
          />
          <div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-gray-600">Size: {size}</p>
            <p className="text-gray-800 font-bold">₹{price}</p>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={userDetails.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={userDetails.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}

          <input
            type="text"
            name="address"
            placeholder="Delivery Address"
            value={userDetails.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}

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

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-lg font-semibold transition-colors"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default CheckoutClient;
