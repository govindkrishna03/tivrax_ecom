'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '../../lib/supabase'; // Make sure supabase client is configured

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get product data from URL
  const productName = searchParams.get('name');
  const productPrice = parseFloat(searchParams.get('price'));
  const productSize = searchParams.get('size');
  const productImg = searchParams.get('img');
  const address = searchParams.get('address');
  const phone = searchParams.get('phone');
  const pincode = searchParams.get('pincode');
  const productId = searchParams.get('id') || 'default-id';

  const upiId = 'tivrax@bank';
  const upiLink = `upi://pay?pa=${upiId}&pn=Tivrax&mc=0000&tid=1234567890&tr=1234567890&tn=Order%20Payment%20for%20${productName}&am=${productPrice?.toFixed(2)}&cu=INR`;

  // Fetch logged-in user from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email || '');
      } else {
        console.error('User not authenticated', error?.message);
      }
    };

    fetchUser();
  }, []);

  const handleConfirmOrder = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method!');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.from('orders').insert([
        {
          product_id: productId,
          product_name: productName,
          price: productPrice,
          size: productSize,
          address,
          phone,
          pincode,
          user_id: userId,
          email: userEmail,
          payment_method: paymentMethod,
          payment_status: 'Pending',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      console.log('Order inserted:', data);
      setOrderConfirmed(true);

      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Error confirming order:', error.message);
      alert('There was a problem confirming your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Complete Your Purchase</h1>

        {/* Product Summary */}
        <div className="flex flex-col sm:flex-row gap-6 items-center mb-10 border p-4 rounded-lg">
          <img
            src={productImg || "/default-product-image.jpg"}
            alt={productName || 'Product'}
            className="w-32 h-32 object-cover rounded-xl border"
          />
          <div>
            <h2 className="text-xl font-semibold">{productName}</h2>
            <p className="text-gray-600">Size: {productSize}</p>
            <p className="text-lg font-bold text-green-700 mt-1">₹{productPrice}</p>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-10 text-sm text-gray-700 space-y-2">
          <p><strong>Shipping Address:</strong> {address}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>Pincode:</strong> {pincode}</p>
        </div>

        {/* Payment Method & QR Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Payment Method Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
            <div className="space-y-4">
              {['Cash on Delivery', 'Google Pay', 'PhonePe'].map((method) => (
                <label key={method} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-blue-600"
                    disabled={isSubmitting}
                  />
                  <span className="text-gray-800">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* QR and Pay */}
          {paymentMethod && paymentMethod !== 'Cash on Delivery' && (
            <div className="bg-gray-50 border rounded-lg p-4 text-center">
              <h4 className="text-md font-semibold mb-2 text-gray-800">
                Scan or Tap to Pay with {paymentMethod}
              </h4>
              <img
                src="/gpay.jpeg"
                alt="QR Code"
                className="w-44 h-44 object-contain mx-auto rounded-md border mb-4"
              />
              <p className="text-sm text-gray-600 mb-2">
                UPI ID: <strong>{upiId}</strong>
              </p>
              <a
                href={upiLink}
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all"
              >
                Pay Now via UPI App
              </a>
            </div>
          )}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmOrder}
          disabled={isSubmitting}
          className={`mt-10 w-full ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg text-lg font-semibold transition-all`}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Order'}
        </button>
      </div>

      {/* Popup Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm mx-auto">
            <h2 className="text-xl font-bold text-yellow-600 mb-2">Confirmation Pending</h2>
            <p className="text-gray-700 mb-4">Your order has been received. We will update the status in your orders tab soon.</p>
            <p className="text-sm text-gray-500">Redirecting you to the homepage...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap with Suspense for Next.js 15.3
export default function PaymentPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPage />
    </Suspense>
  );
}
