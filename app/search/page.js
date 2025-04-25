'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;

        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setFiltered([]);
    } else {
      const result = products.filter((product) =>
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(result);
    }
  }, [query, products]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        router.push('/');
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [router]);

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-black text-white px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>
      {query && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} passHref legacyBehavior>
                <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center cursor-pointer">
                  <img
                    src={product.image_url || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-4 rounded"
                    onError={(e) => {
                      e.target.src = '/placeholder.png';
                    }}
                  />
                  <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                  <p className="text-gray-500 mb-2">₹{product.price}</p>
                  <button 
                    className="mt-auto bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                    onClick={(e) => e.preventDefault()} // Prevent link navigation
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              {products.length === 0 ? 'No products available' : 'No products found'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}