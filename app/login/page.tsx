/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

// Google Sign-In types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  // Initialize Google Identity Services
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          // auto_select: true,     // optional: auto prompt kalau user pernah login sebelumnya
          // cancel_on_tap_outside: false,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    setGoogleLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Google login gagal");
      }

      const data = await res.json();
      Cookies.set("token", data.access_token, { expires: 1 }); // sesuaikan expiry sesuai kebutuhan
      router.push("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      alert("Gagal masuk dengan Google. Coba lagi atau pakai email ya!");
    } finally {
      setGoogleLoading(false);
    }
  };

  const triggerGooglePrompt = () => {
    if (!window.google?.accounts?.id) {
      alert("Google Sign-In belum siap. Refresh halaman dulu!");
      return;
    }
    setGoogleLoading(true);
    window.google.accounts.id.prompt(); // ini yang buka popup One Tap atau selector account
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Login gagal");
      }

      const data = await res.json();
      Cookies.set("token", data.access_token, { expires: 1 });
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Email atau password salah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full">
      {/* Brand Side */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-10 text-white relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-40 -top-20 -right-20"></div>
        <div className="absolute w-96 h-96 bg-teal-400 rounded-full blur-3xl opacity-40 -bottom-20 -left-20"></div>
        <div className="z-10 text-center">
          <h1 className="text-6xl font-black mb-4 tracking-tighter">NgeMood.</h1>
          <p className="text-indigo-100 text-xl font-light">
            Gak perlu drama, <br />
            cukup cerita ke AI.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-2 text-slate-800">Welcome Back 👋</h2>
          <p className="text-slate-400 mb-8">Masuk dulu biar bisa curhat.</p>

          {/* Custom Google Button */}
          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <div className="mb-6">
              <button
                type="button"
                onClick={triggerGooglePrompt}
                disabled={googleLoading || loading}
                className={`
                  w-full flex items-center justify-center gap-3 
                  bg-white border border-slate-300 
                  rounded-xl px-5 py-3.5 
                  text-slate-800 font-medium 
                  hover:bg-slate-50 hover:border-slate-400 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                  transition-all shadow-sm
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}
              >
                {/* Google Logo resmi (SVG inline) */}
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.47 3.09-7.25z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.63c-1.01.68-2.29 1.08-3.93 1.08-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.77 20.39 6.62 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.51 14.21c-.23-.68-.36-1.41-.36-2.21s.13-1.53.36-2.21V7.34H.96C.35 8.85 0 10.39 0 12s.35 3.15.96 4.66l4.55-2.45z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.62 0 2.77 2.61 0.96 6.34l4.55 2.45C6.42 7.02 8.98 4.98 12 4.98z"
                    fill="#EA4335"
                  />
                </svg>

                <span>Masuk dengan Google</span>
              </button>

              {googleLoading && (
                <p className="text-center text-sm text-slate-500 mt-2">
                  Sedang memproses...
                </p>
              )}
            </div>
          )}

          {/* Divider */}
          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-500">atau pakai email</span>
              </div>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading || googleLoading}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading || googleLoading}
            />
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? "Sabar..." : "Masuk"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link href="/register" className="text-indigo-600 font-bold hover:underline">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}