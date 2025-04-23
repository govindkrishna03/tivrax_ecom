"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import OrderSummary from "../../components/checkout/OrderSummary";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import PaymentSection from "../../components/checkout/PaymentSection";
import ConfirmationModal from "../../components/checkout/ConfirmationModal";
import CheckoutSteps from "../../components/checkout/CheckoutSteps";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const productParam = searchParams.get("products");
  const products = productParam ? JSON.parse(decodeURIComponent(productParam)) : [];
  
  const [checkoutProducts, setCheckoutProducts] = useState(products);
  
  // For demonstration, assuming a single product is passed for simplicity.
  const name = searchParams.get("name");
  const price = searchParams.get("price");
  const size = searchParams.get("size");
  const img = searchParams.get("img");
  const productId = searchParams.get("productId");
  const productLink = searchParams.get("productLink");

  // Calculate total price
  const totalPrice = products.length > 0
    ? products.reduce((sum, product) => sum + parseFloat(product.price) * (product.quantity || 1), 0)
    : parseFloat(price || "0");

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    email: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        console.error("User not authenticated", error?.message);
        router.push("/login"); // Redirect if not authenticated
      }
    };

    fetchUser();
  }, [router]);

  const handleFormComplete = (data) => {
    setFormData(data);
    setCurrentStep(2);
  };

  const handlePaymentComplete = async (method) => {
    setPaymentMethod(method);
    setIsSubmitting(true);

    const istNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));


    try {
      const { data, error } = await supabase
      .from("orders")
      .insert(
        checkoutProducts.map(product => ({
          user_id: userId,
          product_id: product.productId, // ✅ this must match what's passed from cart
          product_name: product.name,
          product_size: product.size,
          product_link: product.productLink,
          product_image: product.image,
          quantity: product.quantity || 1,
          total_price: (product.price || 0) * (product.quantity || 1),
          shipping_address: formData.address,
          phone_number: formData.phone,
          email: formData.email,
          order_status: "Pending",
          payment_mode: method,
          created_at: istNow.toISOString(),
          updated_at: istNow.toISOString(),
        }))
      )
      .select();
    
      if (error) {
        console.error("Error inserting order:", error.message);
        alert("There was an error confirming your order: " + error.message);
        return;
      }

      if (!data || data.length === 0) {
        console.error("No data returned from order insertion.");
        alert("There was an issue with your order. Please try again.");
        return;
      }

      console.log("Order confirmed:", data);
      setOrderId(data[0].id);
      setOrderConfirmed(true);

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      console.error("Error processing payment:", err);
      alert("There was an issue with payment processing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>

        {/* Checkout Step Indicator */}
        <CheckoutSteps currentStep={currentStep} />

        {/* Checkout Form & Order Summary Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {currentStep === 1 && (
              <CheckoutForm
                initialData={formData}
                onComplete={handleFormComplete}
              />
            )}
            {currentStep === 2 && (
              <PaymentSection
                onSelectPayment={handlePaymentComplete}
                isProcessing={isSubmitting}
                formData={formData}
              />
            )}
          </div>

          <div className="md:col-span-1">
            <OrderSummary
              productName={name}
              price={price}
              size={size}
              image={img}
              products={products} 
              totalPrice={totalPrice}
            />
          </div>
        </div>
      </div>

      {orderConfirmed && (
        <ConfirmationModal
          orderId={orderId}
          paymentMethod={paymentMethod}
        />
      )}
    </div>
  );
}