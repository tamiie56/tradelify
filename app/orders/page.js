"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchOrders();
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
      <main>
        <Navbar />
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">লোড হচ্ছে...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">আমার অর্ডার</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-gray-500 text-lg mb-4">কোনো অর্ডার নেই</p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              পণ্য কিনুন
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link href={`/orders/${order._id}`} key={order._id}>
                <div className="bg-white rounded-xl shadow hover:shadow-md transition p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-500">অর্ডার ID</p>
                      <p className="font-mono text-sm font-medium">
                        {order._id}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      {getStatusText(order.orderStatus)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>📦</span>
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                    <span className="font-bold text-blue-600 text-base">
                      ৳ {order.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}