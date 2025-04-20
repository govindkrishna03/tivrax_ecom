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

  // ... rest of the code remains unchanged ...

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
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Admin Order Dashboard</h1>

      <div className="flex justify-between items-center mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-md shadow-sm"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Success</option>
          <option>Failed</option>
        </select>

        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Product</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Size</th>
                <th className="px-4 py-2 border">Payment</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="text-center">
                  <td className="px-4 py-2 border">{order.product_name}</td>
                  <td className="px-4 py-2 border">{order.email}</td>
                  <td className="px-4 py-2 border">₹{order.price}</td>
                  <td className="px-4 py-2 border">{order.size}</td>
                  <td className="px-4 py-2 border">{order.payment_method}</td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => updateStatus(order.id, 'Success')}
                      className="text-green-600 hover:underline"
                    >
                      Mark Success
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, 'Failed')}
                      className="text-red-600 hover:underline"
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
  );
};

export default AdminPage;
