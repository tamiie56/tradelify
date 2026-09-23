"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session) {
      setFormData({
        name: session.user.name || "",
        phone: "",
        address: "",
      });
    }
  }, [status, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <main>
        <Navbar />
        <div className="text-center py-20">
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">আমার প্রোফাইল</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  {session?.user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <h2 className="font-bold text-gray-800 text-lg">
                {session?.user?.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{session?.user?.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                session?.user?.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {session?.user?.role === "admin" ? "Admin" : "User"}
              </span>

              <div className="mt-4 space-y-2">
                <Link
                  href="/orders"
                  className="block w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                >
                  আমার অর্ডার
                </Link>
                {session?.user?.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="block w-full bg-purple-50 text-purple-600 py-2 rounded-lg hover:bg-purple-100 transition text-sm font-medium"
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                তথ্য আপডেট করুন
              </h2>

              {success && (
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
                  ✅ প্রোফাইল আপডেট হয়েছে!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    নাম
                  </label>
                  <input
                    type="text"
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
                    value={session?.user?.email || ""}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ফোন নম্বর
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ঠিকানা
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                    placeholder="আপনার ঠিকানা"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}