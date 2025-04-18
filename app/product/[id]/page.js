'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const ProductDescriptionPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [pincode, setPincode] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      const response = await fetch(`/api/product`);
      const data = await response.json();

      console.log(data);  

      const product = data.find((p) => p.P_ID.toString() === id);
      setProduct(product);
    };

    fetchProductData();
  }, [id]);

  const handlePincodeCheck = () => {
    // List of example pincodes for demonstration
    const availablePincodes = ["110001", "110002", "110003", "110004"];
    
    if (availablePincodes.includes(pincode)) {
      setDeliveryAvailable(true);
    } else {
      setDeliveryAvailable(false);
    }
  };

  if (!product) {
    return <p className="text-center text-lg text-gray-600">Product not found</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Product Image */}
        <div className="flex-shrink-0 w-full md:w-1/2 p-6">
          <img
            src={product.P_Image}
            alt={product.P_Name}
            className="object-contain w-full h-full rounded-md shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          {/* Product Name */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">{product.P_Name}</h1>
          <p className="text-lg text-gray-600 mt-1">Size: {product.Size}</p>

          {/* Price */}
          <p className="text-4xl font-bold text-black mt-2">₹{product.Rate}</p>

          {/* Product Description */}
          <p className="text-base text-gray-700 mt-4">{product.Description}</p>

          {/* Pincode Check */}
          <div className="mt-6">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter your pincode"
              className="border border-gray-300 rounded-lg p-3 w-full mt-2"
            />
            <button
              onClick={handlePincodeCheck}
              className="mt-2 bg-black text-white px-6 py-2 rounded-lg w-full"
            >
              Check Delivery
            </button>
            {deliveryAvailable !== null && (
              <p className={`mt-2 text-lg ${deliveryAvailable ? "text-green-500" : "text-red-500"}`}>
                {deliveryAvailable ? "Delivery is available in your area!" : "Sorry, we don't deliver to this pincode."}
              </p>
            )}
          </div>

          {/* Buy Now Button */}
          <button className="mt-6 bg-black text-white px-6 py-2 rounded-lg">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionPage;
