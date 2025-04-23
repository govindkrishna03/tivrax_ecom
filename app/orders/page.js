"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  PackageCheck,
} from "lucide-react";
import Loading from "../../components/Loading";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        router.push("/signin");
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          user_id,
          product_id,
          quantity,
          total_price,
          order_status,
          phone_number,
          email,
          shipping_address,
          created_at,
          updated_at,
          products:product_id (
            id,
            name,
            price,
            image_url,
            description
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage("Error fetching orders: " + error.message);
      } else {
        setOrders(data);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [router]);

  const handleRating = async (orderId, rating) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ rating }) // Assuming you have a 'rating' field in your orders table
        .eq("id", orderId);

      if (error) {
        console.error("Error updating rating:", error.message);
        alert("There was an issue with submitting your rating.");
      } else {
        alert("Thank you for your feedback!");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          <PackageCheck className="inline mr-2" size={28} />
          Your Orders
        </h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {orders.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            You haven’t placed any orders yet.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Order #{order.id}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Placed on:{" "}
                      {
                        new Date(order.created_at).toLocaleDateString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      } at{" "}
                      {
                        new Date(order.created_at).toLocaleTimeString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      }
                    </p>
                  </div>
                  <div>
                    <p
                      className={`flex items-center text-sm font-medium ${
                        order.order_status === "Success"
                          ? "text-green-600"
                          : order.order_status === "Failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.order_status === "Success" ? (
                        <>
                          <CheckCircle size={18} className="mr-1" />
                          Placed
                        </>
                      ) : order.order_status === "Failed" ? (
                        <>
                          <AlertCircle size={18} className="mr-1" />
                          Failed
                        </>
                      ) : (
                        <>
                          <XCircle size={18} className="mr-1" />
                          Pending
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  {order.products?.image_url && (
                    <img
                      src={order.products.image_url}
                      alt={order.products.name}
                      className="h-32 w-32 object-contain rounded-md border"
                    />
                  )}

                  <div className="flex-1 text-sm text-gray-600 space-y-2">
                    <p>
                      <strong className="text-gray-700">Product:</strong>{" "}
                      {order.products?.name || "Not Found"}
                    </p>
                    <p>
                      <strong className="text-gray-700">Description:</strong>{" "}
                      {order.products?.description || "—"}
                    </p>
                    <p>
                      <strong className="text-gray-700">Quantity:</strong>{" "}
                      {order.quantity}
                    </p>
                    <p>
                      <strong className="text-gray-700">Total Price:</strong>{" "}
                      ₹{order.total_price}
                    </p>
                    <p>
                      <strong className="text-gray-700">Shipping Address:</strong>{" "}
                      {order.shipping_address}
                    </p>
                  </div>
                </div>

                {/* Track Order Button */}
                <div className="mt-4">
                  <a 
                    href="https://shiprocket.in/" // Replace with the actual tracking URL if available
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Track Order
                  </a>
                </div>

                {/* Rating Section */}
                <div className="mt-4">
                  <span className="text-gray-700">Rate this product:</span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <button
                        key={index}
                        className="text-yellow-500"
                        onClick={() => handleRating(order.id, index + 1)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}