import HeroCarousel from "../components/Carousel";
import ProductCard from "../components/Productcard";
import { getProductData } from "../lib/readExcell";
import CategoryDropdown from "../components/CategoryDropdown";

export default function Home() {
  const products = getProductData();
  const filteredProducts = products.filter(product => product.P_ID);

  return (
    <>
      <CategoryDropdown />
      <HeroCarousel />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 sm:p-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.P_ID}
            id={product.P_ID}
            name={product.P_Name}
            size={product.Size}
            rate={product.Rate}
            image={product.P_Image}
          />
        ))}


      </div>
    </>
  );
}
