'use client';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/utils/api';
import { ArrowLeft, Loader2, Trash2, Calendar } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

interface Journal {
  id: number;
  user_id: number;
  text: string;
  mood: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export default function JournalDetailPage() {
  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();
  const params = useParams();
  const journalId = params.id;

  useEffect(() => {
    const loadJournal = async () => {
      try {
        const res = await fetchWithAuth(`/journals/${journalId}`);
        
        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        const data = await res.json();
        setJournal(data);
      } catch (e) {
        console.error(e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (journalId) {
      loadJournal();
    }
  }, [journalId]);

  const deleteJournal = async () => {
    if (!confirm("Yakin mau hapus jurnal ini?")) return;
    
    try {
      await fetchWithAuth(`/journals/${journalId}`, { method: 'DELETE' });
      router.push('/journals');
    } catch (e) {
      console.error(e);
      alert("Gagal menghapus jurnal");
    }
  };

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('id-ID', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      'senang': 'from-green-500 to-emerald-600',
      'sedih': 'from-blue-500 to-indigo-600',
      'marah': 'from-red-500 to-rose-600',
      'stres': 'from-orange-500 to-amber-600',
      'netral': 'from-slate-500 to-gray-600'
    };
    return colorMap[mood] || 'from-slate-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 h-full items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500 mb-2" />
        <span className="text-xs text-slate-400">Memuat jurnal...</span>
      </div>
    );
  }

  if (notFound || !journal) {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 h-full items-center justify-center p-8">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Jurnal Tidak Ditemukan</h2>
        <p className="text-slate-400 mb-6">Jurnal ini mungkin sudah dihapus.</p>
        <button
          onClick={() => router.push('/journals')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          Kembali ke Daftar Jurnal
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm flex items-center justify-between sticky top-0 z-20 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-none">Detail Jurnal</h1>
            <p className="text-xs text-slate-400 mt-1">ID: #{journal.id}</p>
          </div>
        </div>
        <button
          onClick={deleteJournal}
          className="text-red-500 text-xs font-bold bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition flex items-center gap-1.5"
        >
          <Trash2 size={14} />
          Hapus
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Mood Header Card */}
          <div className={`bg-linear-to-br ${getMoodColor(journal.mood)} text-white p-8 rounded-3xl shadow-xl relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="text-7xl mb-4">{getMoodEmoji(journal.mood)}</div>
              <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
                {journal.mood}
              </h2>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDateTime(journal.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Curhatan Content */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Curhatan Kamu</h3>
            </div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {journal.text}
            </p>
          </div>

          {/* AI Summary */}
          {journal.summary && (
            <div className="bg-linear-to-br from-indigo-50 to-violet-50 p-6 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
                <h3 className="font-bold text-indigo-900">Kata AI Bestie</h3>
              </div>
              <p className="text-indigo-800 leading-relaxed">
                {journal.summary}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-4">Info Jurnal</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-xs text-slate-400 font-medium">Dibuat pada</span>
                <span className="text-sm text-slate-700 font-bold">{formatDateTime(journal.created_at)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-xs text-slate-400 font-medium">Terakhir diupdate</span>
                <span className="text-sm text-slate-700 font-bold">{formatDateTime(journal.updated_at)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-slate-400 font-medium">ID Jurnal</span>
                <span className="text-sm text-slate-700 font-mono">#{journal.id}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-10">
            <button
              onClick={() => router.push('/journal')}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              Buat Jurnal Baru
            </button>
            <button
              onClick={() => router.push('/journals')}
              className="flex-1 bg-white text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-50 transition border border-slate-200"
            >
              Lihat Semua Jurnal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}