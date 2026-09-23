"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      setOrder(data.order);
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

  if (!order) {
    return (
      <main>
        <Navbar />
        <div className="text-center py-20">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-gray-500 text-lg">অর্ডার পাওয়া যায়নি</p>
          <Link href="/" className="text-blue-600 mt-4 inline-block">
            হোমে ফিরুন
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-8">
          <p className="text-4xl mb-2">✅</p>
          <h1 className="text-2xl font-bold text-green-700 mb-1">
            অর্ডার সফল হয়েছে!
          </h1>
          <p className="text-gray-600 text-sm">
            অর্ডার ID: <span className="font-mono font-medium">{order._id}</span>
          </p>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">অর্ডার স্ট্যাটাস</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
              {getStatusText(order.orderStatus)}
            </span>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mt-4">
            {["processing", "shipped", "delivered"].map((status, index) => (
              <div key={status} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  order.orderStatus === status ||
                  (order.orderStatus === "delivered" && index < 2) ||
                  (order.orderStatus === "shipped" && index < 1)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`h-1 w-20 md:w-32 ${
                    (order.orderStatus === "shipped" && index < 1) ||
                    order.orderStatus === "delivered"
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>প্রক্রিয়াধীন</span>
            <span>পাঠানো হয়েছে</span>
            <span>পৌঁছে গেছে</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">অর্ডারকৃত পণ্য</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>📦</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">× {item.quantity}</p>
                </div>
                <p className="font-bold text-gray-800">
                  ৳ {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>সর্বমোট</span>
            <span className="text-blue-600">৳ {order.totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">ডেলিভারি তথ্য</h2>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">নাম:</span> {order.shippingAddress.fullName}</p>
            <p><span className="font-medium">ফোন:</span> {order.shippingAddress.phone}</p>
            <p><span className="font-medium">ঠিকানা:</span> {order.shippingAddress.address}</p>
            <p><span className="font-medium">শহর:</span> {order.shippingAddress.city}</p>
            <p><span className="font-medium">পেমেন্ট:</span> {order.paymentMethod}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/products"
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-center"
          >
            আরও কিনুন
          </Link>
          <Link
            href="/orders"
            className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition text-center"
          >
            আমার অর্ডার
          </Link>
        </div>
      </div>
    </main>
  );
}