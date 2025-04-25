'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading";
import { FaPlus, FaMinus } from "react-icons/fa";

const ProductDescriptionPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    setCurrentUrl(window.location.href);

    const fetchProductData = async () => {
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        const { data: sizesData, error: sizesError } = await supabase
          .from('product_sizes')
          .select('*')
          .eq('product_id', id);

        if (sizesError) throw sizesError;
        setSizes(sizesData);

        // Fetch rating after product data is loaded
        const { data: ratingData, error: ratingError } = await supabase
          .from('orders')
          .select('rating')
          .eq('product_id', id)
          .not('rating', 'is', null);

        if (ratingError) throw ratingError;

        if (ratingData && ratingData.length > 0) {
          const validRatings = ratingData
            .map(r => r.rating)
            .filter(r => r !== null && !isNaN(r));
          
          if (validRatings.length > 0) {
            const avg = validRatings.reduce((acc, val) => acc + val, 0) / validRatings.length;
            setRating(avg.toFixed(1));
          }
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const fetchRating = async () => {
    console.log("fetchRating called with ID:", id);
  
    if (!id || id === "null") {
      console.warn("Invalid product ID passed to fetchRating");
      setRating(null);
      return;
    }
  
    const { data, error } = await supabase
      .from('orders')
      .select('rating')
      .eq('product_id', id)
      .neq('rating', null); // ✅ fix here
  
    if (error) {
      console.error("Error fetching ratings:", error);
      setRating(null);
      return;
    }
  
    const ratings = data.map(r => Number(r.rating)).filter(r => !isNaN(r));
    if (ratings.length === 0) {
      setRating(null);
      return;
    }
  
    const avg = ratings.reduce((acc, val) => acc + val, 0) / ratings.length;
    setRating(avg.toFixed(1));
  };
  
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
      `/checkout?name=${encodeURIComponent(product.name)}&price=${product.discounted_price}&size=${selectedSize}&img=${encodeURIComponent(product.image_url)}&productId=${product.id}&productLink=${encodeURIComponent(currentUrl)}&quantity=${quantity}`
    );
  };

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  if (loading) return <Loading />;
  if (!product) return <p className="text-center text-lg text-red-600 mt-12">Product not found</p>;

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
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className={`p-2 rounded-full ${quantity <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                  <FaMinus />
                </button>
                <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= 10}
                  className={`p-2 rounded-full ${quantity >= 10 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="mt-3">
              {rating ? (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-yellow-400 ${i < Math.round(rating) ? '' : 'opacity-30'}`}>
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({rating})</span>
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">Not yet rated</p>
              )}
            </div>

            <div className="mt-6">
              {product.discounted_price ? (
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-4xl font-bold text-red-600">
                    ₹{product.discounted_price}
                  </span>
                  <span className="text-lg line-through text-gray-400">
                    ₹{product.price}
                  </span>
                  <span className="ml-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                    {Math.round((1 - product.discounted_price / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <p className="text-4xl font-bold text-gray-800 mb-1">
                  ₹{product.price}
                </p>
              )}
              {quantity > 1 && (
                <p className="text-md text-gray-600 mt-1">
                  Total: ₹{(product.discounted_price || product.price) * quantity}
                </p>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold mb-1 text-gray-700">Product Description</h4>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
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
