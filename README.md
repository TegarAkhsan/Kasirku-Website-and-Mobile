# POS SaaS Application

Aplikasi Point of Sales (POS) berbasis SaaS yang lengkap, terdiri dari Backend (Laravel), Frontend Web (React), dan Aplikasi Mobile (Flutter).

## Struktur Project

Project ini terdiri dari 3 bagian utama:
*   **backend/**: API Server menggunakan Laravel 12 & MySQL.
*   **frontend/**: Web Dashboard menggunakan React 19, Tailwind CSS 4 & Vite.
*   **pos_mobile/**: Aplikasi Mobile kasir menggunakan Flutter.

---

## 🚀 Panduan Instalasi

Pastikan Anda telah menginstal tools berikut di komputer Anda:
*   [PHP](https://www.php.net/) >= 8.2 & [Composer](https://getcomposer.org/)
*   [Node.js](https://nodejs.org/) & NPM
*   [Flutter SDK](https://flutter.dev/)
*   [MySQL](https://www.mysql.com/) Database

### 1. Instalasi Backend (Laravel)

Backend berfungsi sebagai penyedia API untuk Web dan Mobile.

1.  Buka terminal dan masuk ke folder `backend`:
    ```bash
    cd backend
    ```

2.  Install dependensi PHP menggunakan Composer:
    ```bash
    composer install
    ```

3.  Salin file konfigurasi `.env`:
    ```bash
    cp .env.example .env
    ```
    *(Pada Windows, Anda bisa copy-paste file `.env.example` dan rename menjadi `.env`)*

4.  Generate Application Key:
    ```bash
    php artisan key:generate
    ```

5.  Konfigurasi Database:
    Buka file `.env` dan sesuaikan koneksi database Anda:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=pos_saas_db  # Pastikan database ini sudah dibuat di MySQL
    DB_USERNAME=root
    DB_PASSWORD=
    ```

6.  Jalankan Migrasi Database (untuk membuat tabel):
    ```bash
    php artisan migrate
    ```

7.  Jalankan Server Backend:
    ```bash
    php artisan serve
    ```
    Server akan berjalan di `http://127.0.0.1:8000`.

---

### 2. Instalasi Frontend Web (React + Vite)

Frontend Web digunakan oleh pemilik toko/admin untuk manajemen.

1.  Buka terminal baru dan masuk ke folder `frontend`:
    ```bash
    cd frontend
    ```

2.  Install dependensi Node.js:
    ```bash
    npm install
    ```

3.  Jalankan Seryer Development:
    ```bash
    npm run dev
    ```
    Frontend biasanya akan berjalan di `http://localhost:5173`.

> **Catatan**: Jika perlu mengubah URL API Backend, cek konfigurasi di source code (biasanya di folder `src/api` atau `src/config`) atau file `.env` jika ada.

---

### 3. Instalasi Aplikasi Mobile (Flutter)

Aplikasi Mobile digunakan untuk operasional kasir.

1.  Buka terminal baru dan masuk ke folder `pos_mobile`:
    ```bash
    cd pos_mobile
    ```

2.  Install dependensi Flutter:
    ```bash
    flutter pub get
    ```

3.  Jalankan Aplikasi:
    Pastikan emulator Android/iOS sudah berjalan atau HP terhubung.
    ```bash
    flutter run
    ```

> **Konfigurasi API di Mobile**:
> Pastikan aplikasi mobile terhubung ke IP address komputer Anda jika menjalankan di device fisik (bukan `localhost` atau `127.0.0.1`, melainkan IP LAN misal `192.168.1.x`). Cek konfigurasi URL API di `lib/core/api_config.dart` atau file sejenis.

---

## Fitur Utama

*   **Multi-Tenant**: Mendukung banyak toko/tenant.
*   **Manajemen Produk & Stok**: Kelola inventaris dengan mudah.
*   **Transaksi Kasir**: Point of sales yang cepat dan responsif.
*   **Laporan**: Analisa penjualan dan performa toko.
*   **Integrasi Pembayaran**: Mendukung gateway pembayaran (Midtrans).

## Lisensi

[MIT License](LICENSE)
