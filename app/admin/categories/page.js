"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session.user.role !== "admin") {
        router.push("/");
      } else {
        fetchCategories();
      }
    }
  }, [status]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setCategories([data.category, ...categories]);
        setFormData({ name: "", description: "", image: "" });
      } else {
        alert(data.error || "ক্যাটাগরি যোগ করা যায়নি");
      }
    } catch (error) {
      alert("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setAdding(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("এই ক্যাটাগরিটি মুছে ফেলতে চান?")) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories(categories.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error(error);
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
            ← পেছনে
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">ক্যাটাগরি ব্যবস্থাপনা</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Category Form */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              নতুন ক্যাটাগরি যোগ করুন
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ক্যাটাগরির নাম *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  placeholder="যেমন: মোবাইল"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  বিবরণ
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  placeholder="ক্যাটাগরির বিবরণ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ছবির URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <button
                type="submit"
                disabled={adding}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {adding ? "যোগ হচ্ছে..." : "ক্যাটাগরি যোগ করুন"}
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              সকল ক্যাটাগরি ({categories.length})
            </h2>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                কোনো ক্যাটাগরি নেই
              </p>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold">
                            {category.name[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">
                          {category.name}
                        </p>
                        <p className="text-xs text-gray-500">{category.slug}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}