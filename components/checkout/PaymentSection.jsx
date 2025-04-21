import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const paymentMethods = [
    {
        id: "cod",
        name: "Cash on Delivery",
        description: "Pay when your order arrives",
        icon: "💵"
    },
    {
        id: "gpay",
        name: "Google Pay",
        description: "Fast and secure payment",
        icon: "📱"
    },
    {
        id: "phonepe",
        name: "PhonePe",
        description: "UPI payments made easy",
        icon: "💳"
    }
];

export default function PaymentSection({
    onSelectPayment,
    isProcessing,
    formData,
}) {
    const [selectedMethod, setSelectedMethod] = useState("");
    const [showUPIButton, setShowUPIButton] = useState(false);
    const [hasPaidByUPI, setHasPaidByUPI] = useState(false);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const priceFromUrl = queryParams.get("price");
        if (priceFromUrl) {
            setAmount(priceFromUrl);
        }
    }, []);

    const handleSelectMethod = (methodId) => {
        setSelectedMethod(methodId);
        if (methodId === "gpay" || methodId === "phonepe") {
            setShowUPIButton(true);
            setHasPaidByUPI(false); // Reset UPI payment status when changing method
        } else {
            setShowUPIButton(false);
        }
    };

    const handleConfirmPayment = () => {
        if (!selectedMethod) {
            alert("Please select a payment method to continue");
            return;
        }
        onSelectPayment(selectedMethod);
    };

    const handlePayByUPI = () => {
        const upiId = process.env.NEXT_PUBLIC_UPI_ID;
        const upiUrl = `upi://pay?pa=${upiId}&pn=Praveen&mc=XXXXXX&tid=XXXXXX&url=XXX&am=${amount}`;
        setHasPaidByUPI(true);
        window.location.href = upiUrl;
    };

    return (
        <div className="space-y-8">
            {/* Delivery Details Section (unchanged) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow-sm p-6"
            >
                {/* ... existing delivery details code ... */}
            </motion.div>

            {/* Payment Methods Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
            >
                <h2 className="text-xl font-bold mb-6 text-gray-900">Choose Payment Method</h2>

                <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                      key={method.id}
                      onClick={() => handleSelectMethod(method.id)}
                      className={`relative rounded-lg border p-4 cursor-pointer transition-all ${selectedMethod === method.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                  >
                      <div className="flex items-center">
                          <div className={`text-xl mr-3 ${selectedMethod === method.id ? "text-blue-500" : "text-gray-400"}`}>
                              {method.icon}
                          </div>
                          <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{method.name}</h3>
                              <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                          <div className="ml-2">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedMethod === method.id
                                      ? "border-blue-500"
                                      : "border-gray-300"
                                  }`}>
                                  {selectedMethod === method.id && (
                                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

                {/* Show Confirm Order button ONLY for COD or after UPI payment */}
                {(selectedMethod === "cod" || hasPaidByUPI) && (
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleConfirmPayment}
                        disabled={!selectedMethod || isProcessing}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium mt-6 transition-all ${
                            !selectedMethod || isProcessing
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing Order...
                            </span>
                        ) : (
                            "Confirm Order"
                        )}
                    </motion.button>
                )}

                {/* Show UPI Pay button for UPI payment methods */}
                {showUPIButton && !hasPaidByUPI && (
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handlePayByUPI}
                        className="w-full py-3 px-4 rounded-lg text-white font-medium mt-6 bg-blue-600 hover:bg-blue-700"
                    >
                        Pay by UPI
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
}