"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session.user.role !== "admin") {
        router.push("/");
      } else {
        fetchOrders();
      }
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, orderStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus }),
      });

      if (res.ok) {
        setOrders(
          orders.map((order) =>
            order._id === id ? { ...order, orderStatus } : order
          )
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processing": return "bg-yellow-100 text-yellow-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "processing": return "প্রক্রিয়াধীন";
      case "shipped": return "পাঠানো হয়েছে";
      case "delivered": return "পৌঁছে গেছে";
      case "cancelled": return "বাতিল";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="text-2xl font-bold text-blue-600">
          TradeLify
        </Link>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          Admin Panel
        </span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
            ← পেছনে
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            অর্ডার ব্যবস্থাপনা ({orders.length})
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-gray-500 text-lg">কোনো অর্ডার নেই</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-gray-600">অর্ডার ID</th>
                    <th className="text-left px-6 py-4 text-gray-600">কাস্টমার</th>
                    <th className="text-left px-6 py-4 text-gray-600">মোট</th>
                    <th className="text-left px-6 py-4 text-gray-600">পেমেন্ট</th>
                    <th className="text-left px-6 py-4 text-gray-600">স্ট্যাটাস</th>
                    <th className="text-left px-6 py-4 text-gray-600">তারিখ</th>
                    <th className="text-left px-6 py-4 text-gray-600">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-xs">
                        {order._id.slice(-8)}...
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{order.shippingAddress?.fullName}</p>
                        <p className="text-gray-500 text-xs">{order.shippingAddress?.phone}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600">
                        ৳ {order.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {order.paymentMethod}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusText(order.orderStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          disabled={updating === order._id}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50"
                        >
                          <option value="processing">প্রক্রিয়াধীন</option>
                          <option value="shipped">পাঠানো হয়েছে</option>
                          <option value="delivered">পৌঁছে গেছে</option>
                          <option value="cancelled">বাতিল</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}