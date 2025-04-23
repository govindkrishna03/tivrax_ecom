'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductData } from '../../../lib/getProductData';
import ProductCard from '../../../components/Productcard';

export default function StylePage() {
  const { category, style } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        const allProducts = await getProductData();
        // Filter products based on category and style
        const filtered = allProducts.filter(product =>
          product.category.toLowerCase() === category.toLowerCase() &&
          product.style.toLowerCase().replace(/\s+/g, '-') === style.toLowerCase()
        );
        setProducts(filtered);
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      }
    };

    fetchAndFilter();
  }, [category, style]);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-6 capitalize">
        {category} / {style.replace(/-/g, ' ')}
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            size={product.product_sizes?.map(s => s.size).join(', ') || 'No sizes available'} // Show all available sizes or fallback
            rate={product.price}
            image={product.image_url || '/placeholder.png'} // Default image if no image is available
          />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No products found for this style.
          </p>
        )}
      </div>
    </div>
  );
}
