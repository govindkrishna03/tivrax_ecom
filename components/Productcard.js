const ProductCard = ({ id, name, rate, size, image }) => {
    if (!id) return null;

    return (
        <div className="w-full max-w-sm h-[400px] mb-10 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col justify-between">
            <a href="#" className="relative flex justify-center items-center">
                <img
                    className="object-cover rounded-t-lg p-5 w-48 h-48"
                    src={image}
                    alt={name}
                />
            </a>

            <div className="px-5 pb-5 flex flex-col items-center justify-center z-10">
                <a href="#" className="text-xl font-semibold text-black text-center">
                    {name}
                </a>

                <div className="flex flex-col items-center justify-center w-full mt-auto">
                    <span className="text-sm text-gray-600 mb-1">Size: {size}</span>
                </div>
                <div className="flex flex-col items-center justify-center w-full mt-auto">
                    <span className="text-3xl font-bold text-black p-2">
                        ₹{rate}
                    </span>
                    <a
                        href="#"
                        className="text-white hover:text-black bg-black hover:bg-white font-medium rounded-4xl w-[50%] text-sm px-5 py-2.5 text-center mt-3"
                    >
                        Add to cart
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
