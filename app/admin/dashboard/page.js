"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session.user.role !== "admin") {
        router.push("/");
      } else {
        fetchStats();
      }
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
      ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      const orders = ordersData.orders || [];
      const products = productsData.products || [];

      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
      {/* Admin Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          TradeLify
        </Link>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          Admin Panel
        </span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">ড্যাশবোর্ড</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">মোট অর্ডার</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {stats.totalOrders}
            </p>
            <p className="text-xs text-gray-400 mt-1">📦 সকল অর্ডার</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">মোট পণ্য</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {stats.totalProducts}
            </p>
            <p className="text-xs text-gray-400 mt-1">🛍️ সকল পণ্য</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">মোট আয়</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">
              ৳{stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">💰 সকল সময়</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">স্বাগতম</p>
            <p className="text-lg font-bold text-purple-600 mt-1">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-400 mt-1">👤 Admin</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/products">
            <div className="bg-blue-600 text-white rounded-xl p-4 text-center hover:bg-blue-700 transition cursor-pointer">
              <p className="text-2xl mb-1">🛍️</p>
              <p className="font-semibold">পণ্য ব্যবস্থাপনা</p>
            </div>
          </Link>
          <Link href="/admin/orders">
            <div className="bg-orange-500 text-white rounded-xl p-4 text-center hover:bg-orange-600 transition cursor-pointer">
              <p className="text-2xl mb-1">📦</p>
              <p className="font-semibold">অর্ডার ব্যবস্থাপনা</p>
            </div>
          </Link>
          <Link href="/admin/categories">
            <div className="bg-green-600 text-white rounded-xl p-4 text-center hover:bg-green-700 transition cursor-pointer">
              <p className="text-2xl mb-1">📁</p>
              <p className="font-semibold">ক্যাটাগরি</p>
            </div>
          </Link>
          <Link href="/admin/users">
            <div className="bg-purple-600 text-white rounded-xl p-4 text-center hover:bg-purple-700 transition cursor-pointer">
              <p className="text-2xl mb-1">👥</p>
              <p className="font-semibold">ব্যবহারকারী</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">সাম্প্রতিক অর্ডার</h2>
            <Link href="/admin/orders" className="text-blue-600 text-sm hover:underline">
              সব দেখুন
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">কোনো অর্ডার নেই</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="text-left py-2">অর্ডার ID</th>
                    <th className="text-left py-2">পরিমাণ</th>
                    <th className="text-left py-2">স্ট্যাটাস</th>
                    <th className="text-left py-2">তারিখ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-mono text-xs">
                        {order._id.slice(-8)}...
                      </td>
                      <td className="py-3 font-bold text-blue-600">
                        ৳ {order.totalPrice.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusText(order.orderStatus)}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}