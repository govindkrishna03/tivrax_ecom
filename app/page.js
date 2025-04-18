import ProductCard from "../components/Productcard";
import { getProductData } from "../lib/readExcell";

export default function Home() {
    const products = getProductData();

    // Filter out products that don't have a valid ProductID
    const filteredProducts = products.filter(product => product.P_ID);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
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
    );
}
