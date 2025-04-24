export const dynamic = 'force-dynamic';
import HeroCarousel from "../components/Carousel";
import ProductCard from "../components/Productcard";
import CategoryDropdown from "../components/CategoryDropdown";
import { getProductData } from "../lib/getProductData";

export default async function Home() {
  let products = [];

  try {
    products = await getProductData();
  } catch (error) {
    console.error("Failed to load product data:", error);
  }

  const filteredProducts = products?.filter((product) => product.id) || [];

  return (
    <>
      <CategoryDropdown />
      <HeroCarousel />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const ratings = product.orders
              ?.map(order => order.rating)
              .filter(rating => typeof rating === 'number');

            const averageRating = ratings.length
              ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
              : null;

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                size={product.product_sizes?.map(s => s.size).join(', ') || 'No sizes available'} 
                rate={product.price}
                discount_rate={product.discounted_price}
                image={product.image_url || '/placeholder.png'}
                rating={averageRating}
              />
            );
          })
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </>
  );
}
