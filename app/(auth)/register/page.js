"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password মিলছে না");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password কমপক্ষে ৬ অক্ষরের হতে হবে");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (error) {
      setError("কিছু একটা সমস্যা হয়েছে");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            TradeLify
          </Link>
          <p className="text-gray-500 mt-2">নতুন অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              নাম
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
              placeholder="আপনার নাম"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
              placeholder="কমপক্ষে ৬ অক্ষর"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password নিশ্চিত করুন
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "রেজিস্টার হচ্ছে..." : "রেজিস্টার করুন"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          আগে থেকে অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}