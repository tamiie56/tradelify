"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session.user.role !== "admin") {
        router.push("/");
      } else {
        fetchUsers();
      }
    }
  }, [status]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`এই ব্যবহারকারীকে ${newRole === "admin" ? "Admin" : "User"} করতে চান?`)) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, role: newRole } : user
          )
        );
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

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
            ← পেছনে
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            ব্যবহারকারী ব্যবস্থাপনা ({users.length})
          </h1>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <p className="text-4xl mb-4">👥</p>
            <p className="text-gray-500 text-lg">কোনো ব্যবহারকারী নেই</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-gray-600">নাম</th>
                    <th className="text-left px-6 py-4 text-gray-600">Email</th>
                    <th className="text-left px-6 py-4 text-gray-600">রোল</th>
                    <th className="text-left px-6 py-4 text-gray-600">যোগদানের তারিখ</th>
                    <th className="text-left px-6 py-4 text-gray-600">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">
                              {user.name[0].toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="px-6 py-4">
                        {user._id !== session?.user?.id && (
                          <button
                            onClick={() => toggleRole(user._id, user.role)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                              user.role === "admin"
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            }`}
                          >
                            {user.role === "admin" ? "User করুন" : "Admin করুন"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}