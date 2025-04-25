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
  const [hoveredStars, setHoveredStars] = useState({});
  const [submittedRatings, setSubmittedRatings] = useState({});
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
          rating,
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
        const ratingsMap = {};
        data.forEach((order) => {
          if (order.rating) ratingsMap[order.id] = order.rating;
        });
        setSubmittedRatings(ratingsMap);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [router]);

  const handleRating = async (orderId, rating) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ rating })
        .eq("id", orderId);

      if (error) {
        console.error("Error updating rating:", error.message);
        alert("There was an issue submitting your rating.");
      } else {
        setSubmittedRatings((prev) => ({ ...prev, [orderId]: rating }));
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  }; const formatDateToIST = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
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
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-md transition">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Order #{order.id}
                    </h3>
                    {order.updated_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Order Placed at: {formatDateToIST(order.updated_at)}
                      </p>
                    )}
                  </div>


                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${order.order_status === "Success"
                        ? "bg-green-100 text-green-700"
                        : order.order_status === "Failed"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {order.order_status}
                  </span>
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
                      <strong className="text-gray-800">Product:</strong>{" "}
                      {order.products?.name || "Not Found"}
                    </p>
                    <p>
                      <strong className="text-gray-800">Description:</strong>{" "}
                      {order.products?.description || "—"}
                    </p>
                    <p>
                      <strong className="text-gray-800">Quantity:</strong>{" "}
                      {order.quantity}
                    </p>
                    <p>
                      <strong className="text-gray-800">Total Price:</strong>{" "}
                      ₹{order.total_price}
                    </p>
                    <p>
                      <strong className="text-gray-800">Shipping Address:</strong>{" "}
                      {order.shipping_address}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
                  <a
                    href="https://shiprocket.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
                  >
                    Track Order
                  </a>

                  {/* Rating */}
                  <div>
                    <p className="text-sm text-gray-700 mb-1">Rate this product:</p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={`text-xl ${(hoveredStars[order.id] || submittedRatings[order.id]) >= star
                              ? "text-yellow-500"
                              : "text-gray-300"
                            }`}
                          onMouseEnter={() =>
                            setHoveredStars((prev) => ({
                              ...prev,
                              [order.id]: star,
                            }))
                          }
                          onMouseLeave={() =>
                            setHoveredStars((prev) => ({
                              ...prev,
                              [order.id]: 0,
                            }))
                          }
                          onClick={() => handleRating(order.id, star)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    {submittedRatings[order.id] && (
                      <p className="text-xs text-green-600 mt-1">
                        You rated this {submittedRatings[order.id]} star
                        {submittedRatings[order.id] > 1 ? "s" : ""}
                      </p>
                    )}
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
