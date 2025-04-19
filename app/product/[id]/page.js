'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";  // Use useRouter instead of useParams

const ProductDescriptionPage = () => {
  const { query } = useRouter();  // Use query parameter from useRouter
  const id = query.id;  // Get product ID from the URL
  const [product, setProduct] = useState(null);
  const [pincode, setPincode] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);  // Add loading state

  useEffect(() => {
    if (id) {
      const fetchProductData = async () => {
        try {
          const response = await fetch(`/api/product`);
          const data = await response.json();
          
          // Find the product based on the URL id
          const product = data.find((p) => p.P_ID.toString() === id);
          setProduct(product);
        } catch (error) {
          console.error("Error fetching product data", error);
        } finally {
          setLoading(false);  // Set loading to false once data is fetched
        }
      };

      fetchProductData();
    }
  }, [id]);

  const handlePincodeCheck = () => {
    const availablePincodes = ["110001", "110002", "110003", "110004"];
    setDeliveryAvailable(availablePincodes.includes(pincode));
  };

  if (loading) {
    return <p className="text-center text-lg text-gray-600 mt-12">Loading...</p>;  // Show loading message
  }

  if (!product) {
    return <p className="text-center text-lg text-gray-600 mt-12">Product not found</p>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Product Image */}
        <div className="lg:w-1/2 w-full p-8 bg-gray-50 flex items-center justify-center">
          <img
            src={product.P_Image}
            alt={product.P_Name}
            className="object-contain h-[400px] w-full rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 w-full p-8 flex flex-col justify-between">
          {/* Name */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.P_Name}</h1>
            <p className="text-gray-500 text-lg mt-2">{product.Category}</p>

            {/* Size Selector */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Select Size</h3>
              <div className="flex gap-4 flex-wrap">
                {(Array.isArray(product.Size) ? product.Size : product.Size?.split(','))?.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center
                      font-medium transition-all duration-200
                      ${selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:border-black"}`}
                  >
                    {size.trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mt-6">
              <p className="text-3xl font-bold text-gray-800">₹{product.Rate}</p>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-1 text-gray-700">Product Description</h4>
              <p className="text-gray-600 leading-relaxed">{product.Description}</p>
            </div>

            {/* Pincode Checker */}
            <div className="mt-8">
              <h4 className="text-md font-semibold mb-2 text-gray-700">Check Delivery</h4>
              <div className="flex gap-3 flex-col sm:flex-row">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter your pincode"
                  className="border border-gray-300 rounded-md px-4 py-3 w-full sm:w-1/2"
                />
                <button
                  onClick={handlePincodeCheck}
                  className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-md transition-colors w-full sm:w-auto"
                >
                  Check Delivery
                </button>
              </div>
              {deliveryAvailable !== null && (
                <p className={`mt-3 text-md ${deliveryAvailable ? "text-green-600" : "text-red-600"}`}>
                  {deliveryAvailable
                    ? "✅ Delivery is available in your area!"
                    : "❌ Sorry, we don't deliver to this pincode."}
                </p>
              )}
            </div>
          </div>

          {/* Buy Now */}
          <div className="mt-10">
            <button className="w-full bg-black hover:bg-gray-900 text-white py-4 text-lg font-semibold rounded-lg transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionPage;
