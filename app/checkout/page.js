"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "COD",
    note: "",
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      alert("কার্ট খালি আছে!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
          },
          paymentMethod: formData.paymentMethod,
          note: formData.note,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("cart");
        router.push(`/orders/${data.order._id}`);
      } else {
        alert(data.error || "অর্ডার দেওয়া যায়নি");
      }
    } catch (error) {
      alert("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">চেকআউট</h1>

        {!session && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
            অর্ডার দিতে{" "}
            <Link href="/login" className="font-semibold underline">
              লগইন করুন
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  ডেলিভারি তথ্য
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      পূর্ণ নাম
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                      placeholder="আপনার পূর্ণ নাম"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ফোন নম্বর
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ঠিকানা
                    </label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                      placeholder="বাড়ি নং, রাস্তা, এলাকা"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      শহর
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                      placeholder="ঢাকা"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      পোস্টাল কোড
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                      placeholder="1200"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  পেমেন্ট পদ্ধতি
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium">💵 ক্যাশ অন ডেলিভারি</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="bKash"
                      checked={formData.paymentMethod === "bKash"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium">📱 বিকাশ</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="Nagad"
                      checked={formData.paymentMethod === "Nagad"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium">📱 নগদ</span>
                  </label>
                </div>
              </div>

              {/* Note */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  অতিরিক্ত নোট (ঐচ্ছিক)
                </h2>
                <textarea
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  placeholder="অর্ডার সম্পর্কে কোনো বিশেষ নির্দেশনা..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-lg"
              >
                {loading ? "অর্ডার দেওয়া হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                অর্ডার সারসংক্ষেপ
              </h2>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-green-600">বিনামূল্যে</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 text-lg">
                  <span>সর্বমোট</span>
                  <span className="text-blue-600">
                    ৳ {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}