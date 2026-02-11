'use client';
import { useState, useRef, useEffect } from 'react';
import { fetchWithAuth } from '@/utils/api';
import { ArrowLeft, Send, Sparkles, User, Bot, RefreshCcw, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface JournalResult {
  mood: string;
  emotion_score: number;
  summary: string;
  journal_id: number;
  created_at: string;
}

export default function Journal() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JournalResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto scroll ke bawah saat ada pesan baru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [result, loading]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    
    try {
      const res = await fetchWithAuth('/journal', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("AI lagi pusing, coba bentar lagi ya.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setText('');
  };

  const viewJournalDetail = () => {
    if (result?.journal_id) {
      router.push(`/journals/${result.journal_id}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full relative">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm flex items-center gap-4 sticky top-0 z-20 border-b border-slate-100">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-slate-800 text-lg leading-none">Teman Curhat</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-xs text-slate-400 font-medium">Online • NgeMood AI</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
        
        {/* AI Greeting (Static) */}
        <div className="flex gap-4 animate-in slide-in-from-left-2 duration-500">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-200">
            <Bot size={20} />
          </div>
          <div className="space-y-1 max-w-[85%]">
            <span className="text-[10px] text-slate-400 font-bold ml-1">AI Bestie</span>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-600 border border-slate-100 leading-relaxed">
              Yo Bestie! 👋 <br/>
              Gak perlu dipendem sendiri. Ceritain aja hari lo, mau seneng, sedih, atau kesel, gue dengerin kok. No judgement.
            </div>
          </div>
        </div>

        {/* User Message (Muncul setelah kirim) */}
        {(text && (loading || result)) && (
          <div className="flex gap-4 justify-end animate-in slide-in-from-right-2 duration-500">
            <div className="space-y-1 max-w-[85%] flex flex-col items-end">
               <span className="text-[10px] text-slate-400 font-bold mr-1">You</span>
               <div className="bg-linear-to-br from-indigo-600 to-violet-600 p-4 rounded-2xl rounded-tr-none shadow-md text-sm text-white leading-relaxed">
                {text}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 border border-slate-300">
                <User size={20} />
            </div>
          </div>
        )}

        {/* Loading Bubble */}
        {loading && (
           <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Sparkles size={18} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
           </div>
        )}

        {/* AI Response Bubble */}
        {result && (
          <div className="flex gap-4 animate-in slide-in-from-bottom-4 duration-700">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-200">
              <Bot size={20} />
            </div>
            <div className="space-y-2 max-w-[90%] md:max-w-[85%]">
              <span className="text-[10px] text-slate-400 font-bold ml-1">AI Bestie</span>
              
              <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-md border border-slate-100 text-sm text-slate-600">
                {/* Mood Badge */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2
                        ${result.mood === 'senang' ? 'bg-green-100 text-green-700' : 
                          result.mood === 'sedih' ? 'bg-blue-100 text-blue-700' :
                          result.mood === 'marah' ? 'bg-red-100 text-red-700' :
                          result.mood === 'stres' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                        {result.mood === "senang" ? "🥰 Happy" : 
                         result.mood === "sedih" ? "😢 Sad" : 
                         result.mood === "marah" ? "🤬 Angry" : 
                         result.mood === "stres" ? "🤯 Stressed" : "😐 Neutral"}
                    </div>
                </div>

                {/* Content */}
                <p className="leading-relaxed text-slate-700">
                    {result.summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition pl-1 pt-1"
                >
                  <RefreshCcw size={14} />
                  Curhat lagi dong
                </button>
                <button
                  onClick={viewJournalDetail}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-violet-600 transition pl-1 pt-1"
                >
                  <Eye size={14} />
                  Lihat Detail
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible div untuk auto scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Sticky Bottom) */}
      {!result && (
        <div className="p-4 md:p-6 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-20">
          <div className="relative group">
            <textarea
              className="w-full bg-slate-50 rounded-2xl p-4 pr-14 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none h-20 border border-slate-200 placeholder:text-slate-400"
              placeholder="Ketik curhatan lo di sini..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if(text.trim()) submit(e);
                }
              }}
            />
            <button
              onClick={submit}
              disabled={loading || !text.trim()}
              className="absolute right-2 bottom-2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition shadow-lg shadow-indigo-200 active:scale-95"
            >
              {loading ? (
                <Sparkles size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-300 mt-2">AI juga bisa salah, jangan baper ya.</p>
        </div>
      )}
    </div>
  );
}