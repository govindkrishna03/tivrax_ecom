'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductData } from '../../../lib/getProductData';
import ProductCard from '../../../components/Productcard';
import { supabase } from '../../../lib/supabase';

export default function StylePage() {
  const { category, style } = useParams();
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({}); // key: product_id, value: average rating

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        const allProducts = await getProductData();
        const filtered = allProducts.filter(product =>
          product.category.toLowerCase() === category.toLowerCase() &&
          product.style.toLowerCase().replace(/\s+/g, '-') === style.toLowerCase()
        );

        setProducts(filtered);
        fetchRatings(filtered.map(p => p.id));
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      }
    };

    const fetchRatings = async (productIds) => {
      const { data, error } = await supabase
        .from('orders')
        .select('product_id, rating')
        .in('product_id', productIds)
        .not('rating', 'is', null);

      if (error) {
        console.error("Error fetching ratings:", error);
        return;
      }

      const grouped = data.reduce((acc, { product_id, rating }) => {
        if (!acc[product_id]) acc[product_id] = [];
        acc[product_id].push(rating);
        return acc;
      }, {});

      const averageRatings = {};
      for (const [productId, ratingList] of Object.entries(grouped)) {
        const avg = ratingList.reduce((a, b) => a + b, 0) / ratingList.length;
        averageRatings[productId] = avg.toFixed(1);
      }

      setRatings(averageRatings);
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
              size={product.product_sizes?.map(s => s.size).join(', ') || 'No sizes available'}
              rate={product.price}
              discount_rate={product.discounted_price}
              image={product.image_url || '/placeholder.png'}
              rating={ratings[product.id]} // ✅ use computed rating
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
