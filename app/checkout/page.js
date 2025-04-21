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
  
  const name = searchParams.get("name");
  const price = searchParams.get("price");
  const size = searchParams.get("size");
  const img = searchParams.get("img");
  const productId = searchParams.get("productId");
  
  const totalPrice = products.length > 0 
    ? products.reduce((sum, product) => sum + parseFloat(product.price), 0)
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
  }, []);

  const handleFormComplete = (data) => {
    setFormData(data);
    setCurrentStep(2);
  };

  const handlePaymentComplete = async (method) => {
    setPaymentMethod(method);
    setIsSubmitting(true);

    try {
      const generatedOrderId = `ORDER-${Date.now()}`;

      const { data, error } = await supabase.from("orders").insert([
        {
          order_id: generatedOrderId,
          product_id: productId,
          product_name: name,
          total_price: totalPrice,
          size,
          shipping_address: formData.address,
          phone: formData.phone,
          pincode: formData.pincode,
          user_id: userId,
          email: formData.email,
          payment_method: method,
          payment_status: "Pending",
          transaction_status: "Confirmation Pending",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error inserting order:", error.message);
        alert("There was an error confirming your order. Please try again.");
      } else {
        console.log("Order confirmed:", data);
        setOrderId(generatedOrderId); 
        setOrderConfirmed(true);
        
        
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
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
            {/* Step 1: User Information Form */}
            {currentStep === 1 && (
              <CheckoutForm 
                initialData={formData}
                onComplete={handleFormComplete}
              />
            )}
            
            {/* Step 2: Payment Section */}
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
