import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            স্বাগতম TradeLify তে!
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            সেরা পণ্য, সেরা দাম — এখনই কিনুন
          </p>
          <Link
            href="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition"
          >
            এখনই কিনুন
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          ক্যাটাগরি
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["মোবাইল", "ল্যাপটপ", "গেমিং", "আনুষাঙ্গিক"].map((cat) => (
            <div
              key={cat}
              className="bg-blue-50 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-100 transition"
            >
              <p className="font-semibold text-blue-700">{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          ফিচার্ড পণ্য
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-4"
            >
              <div className="bg-gray-100 rounded-lg h-40 mb-3 flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="font-semibold text-gray-800">পণ্যের নাম</h3>
              <p className="text-blue-600 font-bold mt-1">৳ ১,০০০</p>
              <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                কার্টে যোগ করুন
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-2xl font-bold text-blue-400 mb-2">TradeLify</p>
          <p className="text-gray-400 text-sm">
            © 2024 TradeLify. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}