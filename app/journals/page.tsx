'use client';
import { useEffect, useState, useCallback } from 'react';
import { fetchWithAuth } from '@/utils/api';
import { ArrowLeft, Loader2, FileText, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Journal {
  id: number;
  user_id: number;
  text: string;
  mood: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export default function JournalsPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadJournals = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/journals?limit=50');
      const data = await res.json();
      setJournals(data.journals || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJournals();
  }, [loadJournals]);

  const deleteJournal = async (id: number) => {
    if (!confirm("Hapus jurnal ini?")) return;
    
    try {
      await fetchWithAuth(`/journals/${id}`, { method: 'DELETE' });
      loadJournals();
    } catch (e) {
      console.error(e);
      alert("Gagal menghapus jurnal");
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('id-ID', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  const getMoodEmoji = (mood: string) => {
    const emojiMap: Record<string, string> = {
      'senang': '🥰',
      'sedih': '😢',
      'marah': '😡',
      'stres': '🤯',
      'netral': '😐'
    };
    return emojiMap[mood] || '😐';
  };

  const getMoodColor = (mood: string) => {
    const colorMap: Record<string, string> = {
      'senang': 'bg-green-100 text-green-700',
      'sedih': 'bg-blue-100 text-blue-700',
      'marah': 'bg-red-100 text-red-700',
      'stres': 'bg-orange-100 text-orange-700',
      'netral': 'bg-slate-100 text-slate-600'
    };
    return colorMap[mood] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm flex items-center gap-4 sticky top-0 z-20 border-b border-slate-100">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-slate-800 text-lg leading-none">Jurnal Saya</h1>
          <p className="text-xs text-slate-400 mt-1">Semua curhatan tersimpan di sini</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 gap-2">
            <Loader2 className="animate-spin text-indigo-500" />
            <span className="text-xs text-slate-400">Mengambil jurnal...</span>
          </div>
        ) : journals.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 gap-4">
            <FileText size={64} className="text-slate-200" />
            <p className="text-slate-400 text-sm">Belum ada jurnal. Yuk mulai curhat!</p>
            <Link 
              href="/journal"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              Buat Jurnal Pertama
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4 pb-10">
            {/* Stats Summary */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Jurnal</p>
                  <p className="text-3xl font-black text-indigo-600">{journals.length}</p>
                </div>
                <FileText size={40} className="text-indigo-100" />
              </div>
            </div>

            {/* Journals List */}
            {journals.map((journal) => (
              <div 
                key={journal.id} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50 hover:shadow-md hover:border-indigo-100 transition group"
              >
                <div className="flex items-start gap-4">
                  {/* Mood Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${getMoodColor(journal.mood)}`}>
                    {getMoodEmoji(journal.mood)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getMoodColor(journal.mood)}`}>
                        {journal.mood}
                      </div>
                      <div className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-full whitespace-nowrap">
                        {formatDate(journal.created_at)} • {formatTime(journal.created_at)}
                      </div>
                    </div>

                    {/* Text Preview */}
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {journal.text}
                    </p>

                    {/* Summary */}
                    {journal.summary && (
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-3">
                        <p className="text-xs text-indigo-700 font-medium">
                          💭 {journal.summary}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/journals/${journal.id}`}
                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
                      >
                        <Eye size={14} />
                        Lihat Detail
                      </Link>
                      <button
                        onClick={() => deleteJournal(journal.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-600 transition ml-auto"
                      >
                        <Trash2 size={14} />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}