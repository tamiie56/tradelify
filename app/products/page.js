"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <main>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">সকল পণ্য</h1>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="পণ্য খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-low">দাম: কম থেকে বেশি</option>
            <option value="price-high">দাম: বেশি থেকে কম</option>
            <option value="newest">নতুন আগে</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">লোড হচ্ছে...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-gray-500 text-lg">কোনো পণ্য পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Link href={`/products/${product._id}`} key={product._id}>
                <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 cursor-pointer">
                  <div className="bg-gray-100 rounded-lg h-40 mb-3 flex items-center justify-center overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    {product.discountPrice > 0 ? (
                      <>
                        <p className="text-blue-600 font-bold">
                          ৳ {product.discountPrice.toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-xs line-through">
                          ৳ {product.price.toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p className="text-blue-600 font-bold">
                        ৳ {product.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                    কার্টে যোগ করুন
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}