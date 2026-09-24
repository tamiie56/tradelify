"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    if (!confirm("এই পণ্যটি মুছে ফেলবেন?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">পণ্য ব্যবস্থাপনা</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              ← ড্যাশবোর্ড
            </Link>
            <Link
              href="/admin/products/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + পণ্য যোগ করুন
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20 text-gray-500">লোড হচ্ছে...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500">কোনো পণ্য নেই</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-600 text-sm">
                <tr>
                  <th className="text-left px-6 py-3">পণ্য</th>
                  <th className="text-left px-6 py-3">দাম</th>
                  <th className="text-left px-6 py-3">স্টক</th>
                  <th className="text-left px-6 py-3">ক্যাটাগরি</th>
                  <th className="text-left px-6 py-3">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>📦</span>
                          )}
                        </div>
                        <span className="font-medium text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      ৳ {product.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} টি` : "স্টক নেই"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm hover:bg-yellow-200"
                        >
                          ✏️ এডিট
                        </Link>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200"
                        >
                          🗑️ মুছুন
                        </button>
                      </div>
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
}