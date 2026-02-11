/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/utils/api';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function FaceCheckIn() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const router = useRouter();

  // Fungsi Matikan Kamera (Cleanup)
  const stopCamera = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setIsCameraOn(false);
    }
  };

  // Matikan kamera otomatis saat pindah halaman
  useEffect(() => {
    return () => {
        stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal akses kamera.");
    }
  };

  const capture = async () => {
    if (!videoRef.current) return;
    setLoading(true);
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg");
    
    try {
      const res = await fetchWithAuth('/face-checkin', {
        method: 'POST',
        body: JSON.stringify({ image: base64 })
      });
      const data = await res.json();
      setResult(data);
      stopCamera();
    } catch (e) {
      console.error(e);
      alert("Gagal deteksi. Coba pencahayaan lebih terang.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="p-6 flex justify-between items-center absolute top-0 w-full z-20">
        <button 
          onClick={() => router.back()} 
          className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white hover:bg-black/60 transition"
        >
            <ArrowLeft />
        </button>
        <span className="text-white/80 font-bold text-sm bg-black/40 px-4 py-1 rounded-full backdrop-blur-md">
          Face AI v2.0
        </span>
      </div>

      <div className="flex-1 relative flex flex-col justify-center overflow-hidden">
        {result && (
            <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
                <div className="text-8xl mb-4 animate-bounce">
                    {result.mood === 'senang' ? '😄' : 
                     result.mood === 'sedih' ? '😢' : 
                     result.mood === 'marah' ? '😡' : 
                     result.mood === 'stres' ? '🤯' : '😐'}
                </div>
                <h2 className="text-white text-4xl font-black uppercase tracking-widest mb-1">
                  {result.mood}
                </h2>
                <p className="text-indigo-400 font-mono text-xs mb-6">
                  Confidence: {(result.confidence * 100).toFixed(0)}%
                </p>
                
                {/* AI Recommendation */}
                <div className="bg-white/10 p-6 rounded-2xl border border-white/10 mb-8 max-w-sm text-center">
                    <p className="text-white text-lg font-medium leading-relaxed">
                      &quot;{result.recommendation}&quot;
                    </p>
                </div>

                <div className="flex gap-4 w-full max-w-sm">
                    <button 
                      onClick={handleRetry} 
                      className="flex-1 bg-gray-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-700 transition"
                    >
                        <RefreshCw size={18} /> Ulang
                    </button>
                    <button 
                      onClick={() => router.push('/dashboard')} 
                      className="flex-1 bg-white text-black py-4 rounded-2xl font-bold hover:bg-gray-200 transition"
                    >
                        Selesai
                    </button>
                </div>
            </div>
        )}

        <div className="relative w-full aspect-3/4 bg-gray-900 mx-auto max-w-lg shadow-2xl">
            {!isCameraOn && !result && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Kamera Mati
                </div>
            )}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover transform scale-x-[-1]" 
            />
        </div>
      </div>

      <div className="p-8 pb-12 bg-linear-to-t from-black via-black/80 to-transparent absolute bottom-0 w-full flex justify-center z-10">
        {!isCameraOn && !result ? (
            <button 
              onClick={startCamera} 
              className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-indigo-900/50 hover:scale-105 transition"
            >
                Mulai Kamera
            </button>
        ) : !result && (
            <button 
                onClick={capture} 
                disabled={loading}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 hover:bg-white/40 transition active:scale-95 disabled:opacity-50"
            >
                {loading ? (
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="w-16 h-16 bg-white rounded-full"></div>
                )}
            </button>
        )}
      </div>
    </div>
  );
}