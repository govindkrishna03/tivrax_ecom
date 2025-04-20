'use client';
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Ensure this import is correct

const CheckoutClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();  // Initialize the router inside the functional component

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
    email: ""
  });

  useEffect(() => {
    // Fetch user data (optional, could be for pre-filling user details)
    // Removed database interaction here, we only handle data from searchParams or local state
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    const { name: userName, phone, address, pincode, email } = userDetails;

    // Prepare order data to pass to the next page (payment)
    const orderData = {
      product_id: productId,
      product_name: name,
      price: parseFloat(price),
      size: size,
      address: address,
      phone: phone,
      pincode: pincode,
      email: email,
    };

    // Navigate to the payment page, passing the order details as query parameters
    router.push(`/payment?name=${encodeURIComponent(name)}&price=${price}&size=${size}&img=${encodeURIComponent(img)}&address=${encodeURIComponent(address)}&phone=${phone}&pincode=${pincode}`);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

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
