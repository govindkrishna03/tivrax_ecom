'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [isAuthorized, setIsAuthorized] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const userEmail = session.user.email;
    if (adminEmails.includes(userEmail)) {
      setIsAuthorized(true);
      fetchOrders();
    } else {
      router.push('/not-authorized');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching orders:', error.message);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: newStatus })
      .eq('id', id);
    if (error) {
      alert('Error updating status');
      return;
    }
    fetchOrders();
  };

  const filteredOrders =
    filter === 'All' ? orders : orders.filter((o) => o.payment_status === filter);

  if (isAuthorized === null) {
    return <div className="text-center mt-10">Checking admin access...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-semibold text-center text-blue-800 mb-6">Admin Order Dashboard</h1>

        <div className="flex justify-between items-center mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-md shadow-sm p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Success</option>
            <option>Failed</option>
          </select>

          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 shadow-md transition"
          >
            Refresh Orders
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto shadow-lg bg-white rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Order_ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Product_ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Product_Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">User</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Price</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Size</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Payment</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Address</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-3">{order.order_id}</td>

                    <td className="px-4 py-3">{order.product_id}</td>
                    <td className="px-4 py-3">{order.product_name}</td>
                    <td className="px-4 py-3">{order.email}</td>
                    <td className="px-4 py-3">₹{order.total_price}</td>
                    <td className="px-4 py-3">{order.size}</td>
                    <td className="px-4 py-3">{order.payment_method}</td>
                    <td className="px-4 py-3">{order.shipping_address}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.payment_status === 'Success'
                            ? 'bg-green-100 text-green-800'
                            : order.payment_status === 'Failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-4">
                      <button
                        onClick={() => updateStatus(order.id, 'Success')}
                        className="text-green-600 hover:underline transition"
                      >
                        Mark Success
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, 'Failed')}
                        className="text-red-600 hover:underline transition"
                      >
                        Mark Failed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
