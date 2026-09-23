"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">আমার কার্ট</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-gray-500 text-lg mb-4">কার্ট খালি আছে</p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              পণ্য কিনুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow p-4 flex gap-4"
                >
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">📦</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-blue-600 font-bold mt-1">
                      ৳ {item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️ মুছুন
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-800">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  অর্ডার সারসংক্ষেপ
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>মোট পণ্য ({cart.length}টি)</span>
                    <span>৳ {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="text-green-600">বিনামূল্যে</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-lg">
                    <span>সর্বমোট</span>
                    <span className="text-blue-600">
                      ৳ {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition block text-center"
                >
                  চেকআউট করুন
                </Link>

                <Link
                  href="/products"
                  className="w-full mt-3 border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition block text-center"
                >
                  আরও কিনুন
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}