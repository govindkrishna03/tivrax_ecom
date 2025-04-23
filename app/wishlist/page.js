'use client';
import { useEffect, useState } from "react";
import { supabase } from '../../lib/supabase';
import Link from "next/link";
import ProductCard from "../../components/Productcard"; 
import { getProductData } from '../../lib/getProductData'; 
import Loading from "../../components/Loading"; 

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchWishlist = async () => {
      setLoading(true);

      // First, get all wishlist items for this user
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', userId);

      if (wishlistError) {
        console.error('Error fetching wishlist:', wishlistError);
        setLoading(false);
        return;
      }

      // Then get all product details for these items
      const productIds = wishlistData.map(item => item.product_id);

      if (productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Fetch product details along with sizes and stock info using getProductData
      const productData = await getProductData(); // This fetches all products with sizes
      const filteredProducts = productData.filter(product => productIds.includes(product.id));

      setProducts(filteredProducts || []);
      setWishlistItems(wishlistData || []);
      setLoading(false);
    };

    fetchWishlist();
  }, [userId]);

  const handleRemoveFromWishlist = async (productId) => {
    if (!userId) return;

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (!error) {
      setProducts(products.filter(product => product.id !== productId));
      setWishlistItems(wishlistItems.filter(item => item.product_id !== productId));
    } else {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-semibold mb-2">My Wishlist</h1>
          <p className="text-gray-600 mb-12">Please login to view your wishlist</p>
          <button 
            className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900"
            onClick={() => window.location.href = '/auth/login'}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-semibold mb-2">My Wishlist</h1>
          <p className="text-gray-600 mb-12">Start adding items to your wishlist</p>
  
          <div className="flex flex-col items-center gap-6">
            <div className="bg-gray-100 rounded-full p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
            <p className="text-gray-600 max-w-md">
              Save your favorite items to your wishlist so you can easily find them later.
            </p>
            <Link href="/" className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">My Wishlist</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="relative group">
            <Link href={`/product/${product.id}`} passHref legacyBehavior>
              <a className="block">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  size={product.product_sizes?.map(s => s.size).join(', ') || 'No sizes available'}
                  rate={product.price}
                  image={product.image_url || '/placeholder.png'}
                />
              </a>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveFromWishlist(product.id);
              }}
              className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all"
              aria-label="Remove from wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="red"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
