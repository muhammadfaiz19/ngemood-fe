# NgeMood - Frontend Client 🎨

Aplikasi web modern (**Client-Side**) yang dibangun menggunakan **Next.js 16**.  
NgeMood menyediakan antarmuka yang **responsif, estetis, dan interaktif** untuk membantu pengguna memantau serta mengekspresikan **mood harian** dengan dukungan **AI**.

---

## 📑 Table of Contents

- [Galeri Aplikasi](#-galeri-aplikasi)
- [Instalasi](#️-instalasi)
- [Konfigurasi Environment](#️-konfigurasi-environment)
- [Development](#-development)
- [Struktur Halaman](#-struktur-halaman)
- [Backend Repository](#-backend-repository)

---

## 📸 Galeri Aplikasi 
> Semua screenshot tersimpan di folder `screenshots/`  

### A. Autentikasi

| Login | Register  |
|------------|----------------|
| ![](screenshots/login-web.png) | ![](screenshots/register-web.png) |

---

### B. Dashboard Utama

| Dashboard |
|-----------------|
| ![](screenshots/dashboard-web.png) |

---

### C. Fitur AI — Face Check-in

| Face Check-in | Hasil Deteksi |
|-------------------|---------------------|
| ![](screenshots/face-checkin-web.png) | ![](screenshots/face-checkin-result-web.png) |

---

### D. Jurnal & Riwayat

| Journal | History |
|--------------|---------------|
| ![](screenshots/journal-web.png) | ![](screenshots/history-web.png) |

---

## 🛠️ Instalasi

Masuk ke folder frontend:

```bash
cd frontend
npm install
```

---

## ⚙️ Konfigurasi Environment

Buat file `.env.local` di dalam folder `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚀 Development

Jalankan server development:

```bash
npm run dev
```

Buka di browser:

```
http://localhost:3000
```

---

## 📂 Struktur Halaman (`app/`)

- `/login` & `/register`  
  Halaman autentikasi (Split Screen)

- `/dashboard`  
  Weekly Vibe & navigasi utama

- `/face-checkin`  
  Deteksi wajah (kamera auto-off)

- `/journal`  
  Chat jurnal & AI

- `/history`  
  Grafik mood & riwayat aktivitas

---

## 🔗 Backend Repository

Backend untuk aplikasi **NgeMood** tersedia pada repository terpisah:

👉 https://github.com/muhammadfaiz19/ngemood-be

Backend ini bertanggung jawab atas:
- Autentikasi pengguna  
- Manajemen data mood & jurnal  
- Integrasi AI  
- REST API untuk frontend client  

Pastikan backend dijalankan terlebih dahulu sebelum menggunakan frontend secara penuh.

---

✨ **NgeMood Frontend Client**  
UI modern untuk pengalaman emosional yang lebih sadar, manusiawi, dan berbasis data.
