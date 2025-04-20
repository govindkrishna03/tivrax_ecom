import HeroCarousel from "../components/Carousel";
import ProductCard from "../components/Productcard";
import CategoryDropdown from "../components/CategoryDropdown";
import { getProductData } from "../lib/readExcell";

export default async function Home() {
  let products = [];

  try {
    products = getProductData(); // If it's not async. If async, await it.
  } catch (error) {
    console.error("Failed to load product data:", error);
  }

  const filteredProducts = products?.filter((product) => product.P_ID) || [];

  return (
    <>
      <CategoryDropdown />
      <HeroCarousel />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.P_ID}
              id={product.P_ID}
              name={product.P_Name}
              size={product.Size}
              rate={product.Rate}
              image={product.P_Image}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </>
  );
}
