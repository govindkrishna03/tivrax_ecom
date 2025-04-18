'use client';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Link from 'next/link'; // Import Link component from Next.js
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/Product_details.xlsx');
      const blob = await res.blob();

      const data = await blob.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setProducts(jsonData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setFiltered([]);
    } else {
      const result = products.filter((product) =>
        product.P_Name?.toLowerCase().includes(query.toLowerCase())
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

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {query && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length > 0 ? (
            filtered.map((product, index) => (
              <Link key={index} href={`/product/${product.P_ID}`}>
                <div
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center"
                >
                  <img
                    src={product.P_Image}
                    alt={product.P_Name}
                    className="w-full h-48 object-contain mb-4 rounded"
                  />
                  <h2 className="text-lg font-semibold mb-1">{product.P_Name}</h2>
                  <p className="text-gray-500 mb-2">₹{product.Rate}</p>
                  <button className="mt-auto bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
