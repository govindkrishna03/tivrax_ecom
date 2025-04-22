'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading"; // 🔁 Update path as needed

const ProductDescriptionPage = () => {
  const { id } = useParams();  // Using the product id from URL params
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);  // To store available sizes
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setCurrentUrl(window.location.href);

    const fetchProductData = async () => {
      try {
        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) {
          throw productError;
        }

        setProduct(productData);

        // Fetch product sizes
        const { data: sizesData, error: sizesError } = await supabase
          .from('product_sizes')
          .select('*')
          .eq('product_id', id);

        if (sizesError) {
          throw sizesError;
        }

        setSizes(sizesData);

      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // const handlePincodeCheck = () => {
  //   if (!/^[1-9][0-9]{5}$/.test(pincode)) {
  //     toast.error("Invalid pincode. Please enter a valid 6-digit pincode.");
  //     setDeliveryAvailable(null);
  //     return;
  //   }

  //   const availablePincodes = ["110001", "110002", "110003", "110004"];
  //   setDeliveryAvailable(availablePincodes.includes(pincode));
  // };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please sign in to continue with your purchase.");
      return;
    }

    if (!selectedSize) {
      toast("Please select a size before proceeding.", { icon: "👕" });
      return;
    }

    router.push(
      `/checkout?name=${encodeURIComponent(product.name)}&price=${product.price}&size=${selectedSize}&img=${encodeURIComponent(product.image_url)}&productId=${product.id}&productLink=${encodeURIComponent(currentUrl)}`
    );
  };

  // ⏳ Show Loading screen
  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return <p className="text-center text-lg text-red-600 mt-12">Product not found</p>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <div className="lg:w-1/2 w-full p-8 bg-gray-50 flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-contain h-[400px] w-full rounded-lg"
          />
        </div>

        <div className="lg:w-1/2 w-full p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-500 text-lg mt-2">{product.category}</p>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Select Size</h3>
              <div className="flex gap-4 flex-wrap">
                {sizes?.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.size)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center
                      font-medium transition-all duration-200
                      ${selectedSize === size.size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:border-black"}`}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold text-gray-800">₹{product.price}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold mb-1 text-gray-700">Product Description</h4>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
{/* 
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
            </div> */}
          </div>

          <div className="mt-10">
            {!user && (
              <div className="mt-8 text-center text-red-600 font-medium text-lg">
                Please <span className="underline cursor-pointer" onClick={() => router.push("/auth/signin")}>log in</span> to proceed with the purchase.
              </div>
            )}

            <button
              onClick={handleBuyNow}
              disabled={!user}
              className={`w-full py-4 text-lg font-semibold rounded-lg transition-colors ${user
                  ? "bg-black hover:bg-gray-900 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
            >
              Buy Now
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionPage;
