import { motion } from "framer-motion";
import { useState, useEffect } from "react"; // Add useEffect import
const paymentMethods = [
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: "💵",
  },
  {
    id: "gpay",
    name: "Google Pay",
    description: "Fast and secure payment",
    icon: "📱",
  },
  {
    id: "phonepe",
    name: "PhonePe",
    description: "UPI payments made easy",
    icon: "💳",
  },
];

export default function PaymentSection({
  onSelectPayment,
  isProcessing,
  formData,
  totalAmount: propTotalAmount, // Rename prop to avoid confusion
  qrCodeUrl = "./gpay.jpeg", 
}) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [hasPaidByUPI, setHasPaidByUPI] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [amountFromUrl, setAmountFromUrl] = useState(null); // New state for URL amount

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      const urlAmount = queryParams.get('price');
      
      if (urlAmount) {
        setAmountFromUrl(parseFloat(urlAmount));
      }
    }
  }, []);

  // Use amount from URL if available, otherwise use prop
  const totalAmount = amountFromUrl !== null ? amountFromUrl : propTotalAmount;
  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    setHasPaidByUPI(false);
    setPaymentStatus("idle");
  };
  

  const handleConfirmPayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method to continue");
      return;
    }

    setPaymentStatus("processing");
    try {
      await onSelectPayment(selectedMethod);
      setPaymentStatus("success");
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      alert("Payment failed. Please try again.");
    }
  };
  const handlePayByUPI = async () => {
  
    const upiId = process.env.NEXT_PUBLIC_UPI_ID;
    if (!upiId) {
      alert("UPI payment is not configured");
      return;
    }
  
    if (!totalAmount || isNaN(totalAmount)) {
      alert("Invalid amount specified");
      return;
    }
  
    const formattedAmount = Number(totalAmount).toFixed(2);
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      "Tivrax"
    )}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(
      `Payment for order`
    )}`;
  
    console.log("UPI URL:", upiUrl);
    setPaymentStatus("processing");
  
    try {
      if (navigator.share) {
        await navigator.share({
          title: "UPI Payment",
          text: `Please pay ₹${formattedAmount} for your order`,
          url: upiUrl,
        });
      } else if (/android/i.test(navigator.userAgent)) {
        window.location.href = upiUrl;
      } else {
        window.open(upiUrl, "_blank");
      }
  
      setHasPaidByUPI(true);
      setPaymentStatus("success");
    } catch (error) {
      console.error("UPI payment error:", error);
      if (error.name !== "AbortError") {
        setPaymentStatus("failed");
      }
    }
  };
  

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          Choose Payment Method
        </h2>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handleSelectMethod(method.id)}
              className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`text-xl mr-3 ${
                    selectedMethod === method.id
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                >
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
                <div className="ml-2">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedMethod === method.id
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(selectedMethod === "gpay" || selectedMethod === "phonepe") && (
          <div className="mt-6 text-center space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Scan QR Code to Pay:</h3>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="mx-auto mt-4 w-40 h-40"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePayByUPI}
              disabled={paymentStatus === "processing"}
              className="w-full py-3 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
            >
              {paymentStatus === "processing" ? "Processing..." : "Pay by UPI ID"}
            </motion.button>
          </div>
        )}

        {(selectedMethod === "cod" || hasPaidByUPI) && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleConfirmPayment}
            disabled={paymentStatus === "processing"}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium mt-6 ${
              paymentStatus === "processing"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {paymentStatus === "processing" ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Order...
              </span>
            ) : (
              "Confirm Order"
            )}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
