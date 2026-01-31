"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      },
    );
    setLoading(false);
    if (res.ok) {
      alert("Akun jadi! Login gih.");
      router.push("/login");
    } else {
      alert("Gagal. Email udah kepake kali?");
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full">
      {/* Brand Side (Sama kayak Login tapi beda warna dikit biar fresh) */}
      <div className="hidden md:flex flex-1 bg-teal-600 items-center justify-center p-10 text-white relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-40 -top-20 -right-20"></div>
        <div className="absolute w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-40 -bottom-20 -left-20"></div>
        <div className="z-10 text-center">
          <h1 className="text-6xl font-black mb-4 tracking-tighter">
            Join Us.
          </h1>
          <p className="text-teal-100 text-xl font-light">
            Mulai peduli sama <br />
            kesehatan mental lo.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-2 text-slate-800">
            Bikin Akun Baru ✨
          </h2>
          <p className="text-slate-400 mb-8">Gratis kok, santai aja.</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="email"
              placeholder="Email aktif lo"
              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password yang kuat"
              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white p-4 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-200 mt-2"
            >
              {loading ? "Bikin..." : "Daftar Sekarang"}
            </button>
          </form>
          <p className="text-center mt-8 text-sm text-slate-500">
            Udah punya akun?{" "}
            <Link
              href="/login"
              className="text-teal-600 font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
