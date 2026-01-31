"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Gagal");
      const data = await res.json();
      Cookies.set("token", data.access_token, { expires: 1 });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Email/Password salah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full">
      {/* Brand Side */}
      <div className="hidden md:flex flex-1 bg-indigo-600 items-center justify-center p-10 text-white relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-40 -top-20 -right-20"></div>
        <div className="absolute w-96 h-96 bg-teal-400 rounded-full blur-3xl opacity-40 -bottom-20 -left-20"></div>
        <div className="z-10 text-center">
          <h1 className="text-6xl font-black mb-4 tracking-tighter">
            NgeMood.
          </h1>
          <p className="text-indigo-100 text-xl font-light">
            Gak perlu drama, <br />
            cukup cerita ke AI.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-2 text-slate-800">
            Welcome Back 👋
          </h2>
          <p className="text-slate-400 mb-8">Masuk dulu biar bisa curhat.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 mt-2"
            >
              {loading ? "Sabar..." : "Masuk"}
            </button>
          </form>
          <p className="text-center mt-8 text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-indigo-600 font-bold hover:underline"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
