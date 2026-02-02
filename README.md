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
-   [Development](#-development)
-   [Struktur Halaman](#-struktur-halaman)

------------------------------------------------------------------------

## 📸 Galeri Aplikasi

> Semua gambar berada di folder `frontend/screenshots/`

### 🔐 Autentikasi

  Login (Web)                      Login (Mobile)
  -------------------------------- ----------------------------
  ![](screenshots/login-web.png)   ![](screenshots/login.png)

  Register (Web)                      Register (Mobile)
  ----------------------------------- -------------------------------
  ![](screenshots/register-web.png)   ![](screenshots/register.png)

------------------------------------------------------------------------

### 🏠 Dashboard Utama

  Dashboard (Web)                      Dashboard (Mobile)
  ------------------------------------ --------------------------------
  ![](screenshots/dashboard-web.png)   ![](screenshots/dashboard.png)

------------------------------------------------------------------------

### 🤖 Fitur AI (Face Check-in)

  -------------------------------------------------------------------------------
  Face Check-in (Web)                     Face Check-in (Mobile)
  --------------------------------------- ---------------------------------------
  ![](screenshots/face-checkin-web.png)   ![](screenshots/face-checkin.png)

  -------------------------------------------------------------------------------

  -----------------------------------------------------------------------------------------
  Hasil Deteksi (Web)                            Hasil Deteksi (Mobile)
  ---------------------------------------------- ------------------------------------------
  ![](screenshots/face-checkin-result-web.png)   ![](screenshots/face-checkin-result.png)

  -----------------------------------------------------------------------------------------

------------------------------------------------------------------------

### 📔 Jurnal & Riwayat

  Journal (Web)                      Journal (Mobile)
  ---------------------------------- ------------------------------
  ![](screenshots/journal-web.png)   ![](screenshots/journal.png)

  History (Web)                      History (Mobile)
  ---------------------------------- ------------------------------
  ![](screenshots/history-web.png)   ![](screenshots/history.png)

------------------------------------------------------------------------

## 🛠️ Instalasi

Masuk ke folder frontend:

``` bash
cd frontend
npm install
```

Konfigurasi environment (`.env.local`):

``` env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

------------------------------------------------------------------------

## 🚀 Development

``` bash
npm run dev
```

Akses melalui browser:\
http://localhost:3000

------------------------------------------------------------------------

## 📂 Struktur Halaman (`app/`)

-   `/login` & `/register` --- Autentikasi (Split Screen)
-   `/dashboard` --- Weekly Vibe & navigasi utama
-   `/face-checkin` --- Deteksi wajah (kamera auto-off)
-   `/journal` --- Chat jurnal & AI
-   `/history` --- Grafik mood & riwayat aktivitas

------------------------------------------------------------------------

✨ **NgeMood Frontend Client**\
UI modern untuk pengalaman emosional yang lebih baik.
