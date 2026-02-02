# NgeMood - Frontend Client 🎨

Aplikasi web modern (Client-Side) yang dibangun menggunakan **Next.js
16**.\
NgeMood menyediakan antarmuka yang **responsif, estetis, dan
interaktif** untuk membantu pengguna memantau dan mengekspresikan mood
harian mereka dengan dukungan AI.

------------------------------------------------------------------------

## 📑 Table of Contents

-   [Galeri Aplikasi](#-galeri-aplikasi)
-   [Instalasi](#️-instalasi)
-   [Konfigurasi Environment](#️-konfigurasi-environment)
-   [Development](#-development)
-   [Struktur Halaman](#-struktur-halaman)

------------------------------------------------------------------------

## 📸 Galeri Aplikasi

*(Semua screenshot tersimpan di folder `screenshots/`)*

### A. Autentikasi

  ---------------------------------------------------------------------------------------------------------------------------------
            Login (Web)                   Login (Mobile)                  Register (Web)                   Register (Mobile)
  -------------------------------- ---------------------------- ----------------------------------- -------------------------------
   ![](screenshots/login-web.png)   ![](screenshots/login.png)   ![](screenshots/register-web.png)   ![](screenshots/register.png)

  ---------------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

### B. Dashboard Utama

            Dashboard (Web)                   Dashboard (Mobile)
  ------------------------------------ --------------------------------
   ![](screenshots/dashboard-web.png)   ![](screenshots/dashboard.png)

------------------------------------------------------------------------

### C. Fitur AI -- Face Check-in

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Face Check-in (Web)                 Face Check-in (Mobile)                     Hasil Deteksi (Web)                         Hasil Deteksi (Mobile)
  --------------------------------------- ----------------------------------- ---------------------------------------------- ------------------------------------------
   ![](screenshots/face-checkin-web.png)   ![](screenshots/face-checkin.png)   ![](screenshots/face-checkin-result-web.png)   ![](screenshots/face-checkin-result.png)

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

### D. Jurnal & Riwayat

  -----------------------------------------------------------------------------------------------------------------------------------
            Journal (Web)                   Journal (Mobile)                  History (Web)                   History (Mobile)
  ---------------------------------- ------------------------------ ---------------------------------- ------------------------------
   ![](screenshots/journal-web.png)   ![](screenshots/journal.png)   ![](screenshots/history-web.png)   ![](screenshots/history.png)

  -----------------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 🛠️ Instalasi

Masuk ke folder frontend:

``` bash
cd frontend
npm install
```

------------------------------------------------------------------------

## ⚙️ Konfigurasi Environment

Buat file `.env.local` di dalam folder `frontend`:

``` env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

------------------------------------------------------------------------

## 🚀 Development

Jalankan server development:

``` bash
npm run dev
```

Buka di browser:

    http://localhost:3000

------------------------------------------------------------------------

## 📂 Struktur Halaman (`app/`)

-   `/login` & `/register`\
    Halaman autentikasi (Split Screen)

-   `/dashboard`\
    Weekly Vibe & navigasi utama

-   `/face-checkin`\
    Deteksi wajah (kamera auto-off)

-   `/journal`\
    Chat jurnal & AI

-   `/history`\
    Grafik mood & riwayat aktivitas

------------------------------------------------------------------------

✨ **NgeMood Frontend Client**\
UI modern untuk pengalaman emosional yang lebih baik.
