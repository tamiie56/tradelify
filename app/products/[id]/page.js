"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data.product);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
        image: product.images?.[0] || "",
        quantity,
      });
    }

        localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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

  if (!product) {
    return (
      <main>
        <Navbar />
        <div className="text-center py-20">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-gray-500 text-lg">পণ্য পাওয়া যায়নি</p>
          <Link href="/products" className="text-blue-600 mt-4 inline-block">
            সকল পণ্য দেখুন
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">হোম</Link>
          {" / "}
          <Link href="/products" className="hover:text-blue-600">পণ্য</Link>
          {" / "}
          <span className="text-gray-800">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center overflow-hidden mb-4">
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-6xl">📦</span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-blue-600"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              {product.discountPrice > 0 ? (
                <>
                  <span className="text-3xl font-bold text-blue-600">
                    ৳ {product.discountPrice.toLocaleString()}
                  </span>
                  <span className="text-gray-400 line-through text-lg">
                    ৳ {product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                    {Math.round(
                      ((product.price - product.discountPrice) /
                        product.price) *
                        100
                    )}% ছাড়
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-blue-600">
                  ৳ {product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock */}
            <p className={`text-sm mb-4 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `✅ স্টকে আছে (${product.stock}টি)` : "❌ স্টক শেষ"}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 font-medium">পরিমাণ:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 text-lg"
                >
                  −
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {added ? "✅ যোগ হয়েছে!" : "🛒 কার্টে যোগ করুন"}
              </button>
              <Link
                href="/checkout"
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition text-center"
              >
                এখনই কিনুন
              </Link>
            </div>

            {/* Description */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-2">বিবরণ</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}