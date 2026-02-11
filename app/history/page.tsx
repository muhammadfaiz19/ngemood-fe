/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState, useCallback } from 'react';
import { fetchWithAuth } from '@/utils/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ScriptableContext
} from 'chart.js';
import { ArrowLeft, Loader2, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

interface MoodEntry {
  id: number;
  user_id: number;
  mood: string;
  confidence: number;
  source: 'face' | 'journal';
  created_at: string;
}

interface MoodHistoryResponse {
  total: number;
  moods: MoodEntry[];
}

export default function History() {
  const [data, setData] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadData = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/moods/history?limit=30');
      const response: MoodHistoryResponse = await res.json();
      setData(response.moods || response as any || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const deleteItem = async (id: number) => {
    if (!confirm("Hapus histori ini?")) return;
    try {
      await fetchWithAuth(`/moods/history/${id}`, { method: 'DELETE' });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteAll = async () => {
    if (!confirm("Yakin mau hapus SEMUA kenangan (history)?")) return;
    try {
      await fetchWithAuth(`/moods/history`, { method: 'DELETE' });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // Mapping Mood ke Angka
  const moodMap: Record<string, number> = { 
    'senang': 5, 
    'netral': 4, 
    'stres': 3, 
    'sedih': 2, 
    'marah': 1 
  };

  // Mapping Angka ke Label
  const scoreToLabel = (score: number) => {
    const map = ['','😡 Marah', '😢 Sedih', '🤯 Stres', '😐 Netral', '🥰 Senang'];
    return map[score] || '';
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('id-ID', { day: 'numeric', month: 'short' });
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Chart Data
  const chartSource = data.slice(0, 10).reverse();
  
  const chartData = {
    labels: chartSource.map(d => formatDate(d.created_at)),
    datasets: [{
      label: 'Mood Level',
      data: chartSource.map(d => moodMap[d.mood] || 3),
      borderColor: '#6366f1',
      borderWidth: 3,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#6366f1',
      pointRadius: 6,
      pointHoverRadius: 8,
      fill: true,
      backgroundColor: (context: ScriptableContext<'line'>) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        return gradient;
      },
      tension: 0.4,
    }]
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 6,
        ticks: {
          stepSize: 1,
          callback: (value: number) => scoreToLabel(value),
          font: { size: 12 }
        },
        grid: { color: '#f1f5f9' }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1b4b',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => `Mood: ${scoreToLabel(context.raw)}`
        }
      }
    }
  };

  // Statistik
  const totalEntries = data.length;
  const moodCounts = data.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dominantMood = Object.keys(moodCounts).length > 0 
    ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, '-')
    : '-';

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm flex items-center justify-between sticky top-0 z-20 border-b border-slate-100">
         <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="font-bold text-slate-800 text-lg leading-none">Jejak Emosi</h1>
                <p className="text-xs text-slate-400 mt-1">Pantau grafik perasaanmu</p>
            </div>
         </div>
         {data.length > 0 && (
            <button 
              onClick={deleteAll} 
              className="text-red-500 text-xs font-bold bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition"
            >
                Reset Data
            </button>
         )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {loading ? (
            <div className="flex flex-col items-center justify-center mt-20 gap-2">
                <Loader2 className="animate-spin text-indigo-500" />
                <span className="text-xs text-slate-400">Mengambil data...</span>
            </div>
        ) : (
          <>
            {/* Chart Area */}
            <div className="bg-white p-6 rounded-3xl shadow-lg shadow-indigo-100/50 border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <TrendingUp size={18} className="text-indigo-500"/> 
                        Grafik Mood (10 Terakhir)
                    </h3>
                </div>
                <div className="h-64 w-full">
                    {data.length > 0 ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-300 text-sm">
                            Belum ada data untuk ditampilkan.
                        </div>
                    )}
                </div>
            </div>

            {/* Mini Stats */}
            {data.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-md">
                        <p className="text-xs opacity-80 uppercase font-bold tracking-wider">Total Entri</p>
                        <p className="text-3xl font-black">{totalEntries}</p>
                    </div>
                    <div className="bg-white text-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Mood Dominan</p>
                        <p className="text-3xl font-black capitalize text-indigo-600">{dominantMood}</p>
                    </div>
                </div>
            )}

            {/* List History */}
            <div className="space-y-3 pb-10">
                <h3 className="font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <Calendar size={18} className="text-slate-400"/> Riwayat Lengkap
                </h3>
                
                {data.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-50 transition hover:shadow-md hover:border-indigo-100 group"
                    >
                        {/* Icon Mood */}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                            item.mood === 'senang' ? 'bg-green-100' : 
                            item.mood === 'marah' ? 'bg-red-100' : 
                            item.mood === 'sedih' ? 'bg-blue-100' : 
                            item.mood === 'stres' ? 'bg-orange-100' : 'bg-slate-100'
                        }`}>
                            {item.mood === 'senang' ? '🥰' : 
                             item.mood === 'sedih' ? '😢' : 
                             item.mood === 'marah' ? '😡' : 
                             item.mood === 'stres' ? '🤯' : '😐'}
                        </div>

                        {/* Text Info */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="font-bold capitalize text-slate-800 text-lg leading-tight">
                                  {item.mood}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">
                                    {formatTime(item.created_at)}
                                </p>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                {formatDate(item.created_at)} • 
                                <span className={`uppercase font-bold text-[9px] ml-1 px-1.5 py-0.5 rounded ${
                                    item.source === 'face' ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'
                                }`}>
                                    {item.source === 'face' ? '📷 Scan Wajah' : '📝 Jurnal'}
                                </span>
                            </p>
                        </div>

                        {/* Delete Button */}
                        <button 
                            onClick={() => deleteItem(item.id)} 
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                            title="Hapus"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}