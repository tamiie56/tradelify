"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          TradeLify
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-8">
          <input
            type="text"
            placeholder="পণ্য খুঁজুন..."
            className="w-full border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
            🔍
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link href="/cart" className="relative">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Auth */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100"
              >
                <span>👤</span>
                <span className="hidden md:block text-sm font-medium">
                  {session.user.name}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-50 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    আমার প্রোফাইল
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 hover:bg-gray-50 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    আমার অর্ডার
                  </Link>
                  {session.user.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-50 text-sm text-blue-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex">
          <input
            type="text"
            placeholder="পণ্য খুঁজুন..."
            className="w-full border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
            🔍
          </button>
        </div>
      </div>
    </nav>
  );
}