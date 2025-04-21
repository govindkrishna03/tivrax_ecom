"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      // Get session (safer than getUser)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        router.push("/login"); // redirect if no session
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
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

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 flex flex-col items-center">
        <Loader2 className="animate-spin mb-2" size={24} />
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md flex-1">
        <h2 className="text-2xl font-bold text-center mb-6">Your Orders</h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {orders.length === 0 ? (
          <div className="text-center text-gray-500">You have no orders yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {order.product_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    {/* Status Handling */}
                    <p
                      className={`text-sm flex items-center ${
                        order.payment_status === "Success"
                          ? "text-green-500"
                          : order.payment_status === "Failed"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {order.payment_status === "Success" ? (
                        <>
                          <CheckCircle className="inline-block mr-2" size={18} />
                          <span>Order Successfully Placed</span>
                        </>
                      ) : order.payment_status === "Failed" ? (
                        <>
                          <AlertCircle className="inline-block mr-2" size={18} />
                          <span>Order Not Placed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="inline-block mr-2" size={18} />
                          <span>Confirmation Pending</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* More Details */}
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    <strong>Payment Status:</strong> {order.payment_status}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ₹{order.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
