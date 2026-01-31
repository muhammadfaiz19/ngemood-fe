/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/api";
import {
  Camera,
  BookOpen,
  BarChart2,
  LogOut,
  Loader2,
  Sparkles,
} from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [recom, setRecom] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchWithAuth("/auth/me")
      .then((res) => res.json())
      .then(setUser)
      .catch(() => {});
    fetchWithAuth("/moods/recommendation")
      .then((res) => res.json())
      .then(setRecom)
      .catch(() => {});
  }, []);

  const logout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      {/* Navbar */}
      <header className="bg-white p-6 md:px-10 flex justify-between items-center border-b border-slate-100">
        <div>
          <h1 className="font-bold text-slate-800 text-lg">
            Hai, {user ? user.email.split("@")[0] : "Kawan"}! 👋
          </h1>
          <p className="text-xs text-slate-400">Semoga hari lo gak suram.</p>
        </div>
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Content Scrollable */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Insight Card (Big) */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-[2rem] shadow-xl shadow-indigo-200 relative overflow-hidden md:col-span-1 md:row-span-2 flex flex-col justify-between min-h-[300px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div>
              <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                <Sparkles size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Weekly Report
                </span>
              </div>
              {recom ? (
                <div className="animate-in fade-in zoom-in duration-500">
                  <h2 className="text-4xl font-black mb-2 capitalize tracking-tight">
                    {recom.dominant_mood}
                  </h2>
                  <p className="text-indigo-100 mb-6 text-sm opacity-90">
                    Vibes lo minggu ini.
                  </p>
                  <div className="space-y-3">
                    {recom.recommendation.map((r: string, i: number) => (
                      <div
                        key={i}
                        className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/5 text-sm leading-relaxed"
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40">
                  <Loader2 className="animate-spin mb-2" />
                  <p className="text-xs opacity-70">Lagi mikir...</p>
                </div>
              )}
            </div>
          </div>

          {/* Menu Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/face-checkin"
              className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100
             hover:border-indigo-500 hover:shadow-md transition
             flex flex-col items-center justify-center text-center gap-3 group h-full"
            >
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                <Camera size={26} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Cek Wajah</h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">
                  AI Scan
                </p>
              </div>
            </Link>

            <Link
              href="/journal"
              className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100
             hover:border-teal-500 hover:shadow-md transition
             flex flex-col items-center justify-center text-center gap-3 group h-full"
            >
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition duration-300">
                <BookOpen size={26} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Curhat</h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">
                  Jurnal
                </p>
              </div>
            </Link>
          </div>

          {/* History Button */}
          <Link
            href="/history"
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                <BarChart2 size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800">Riwayat</h3>
                <p className="text-xs text-slate-400">Cek grafik emosi lo</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition">
              ➜
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
