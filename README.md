# POS SaaS Application

<<<<<<< HEAD
A complete SaaS-based Point of Sales (POS) application, consisting of a Backend (Laravel), Web Frontend (React), and Mobile Application (Flutter).

## Project Structure

The project consists of 3 main parts:
*   **backend/**: API Server using Laravel 12 & MySQL.
*   **frontend/**: Web Dashboard using React 19, Tailwind CSS 4 & Vite.
*   **pos_mobile/**: Cashier Mobile App using Flutter.

---

## 🚀 Installation Guide

Ensure you have the following tools installed on your computer:
=======
Aplikasi Point of Sales (POS) berbasis SaaS yang lengkap, terdiri dari Backend (Laravel), Frontend Web (React), dan Aplikasi Mobile (Flutter).

## Struktur Project

Project ini terdiri dari 3 bagian utama:
*   **backend/**: API Server menggunakan Laravel 12 & MySQL.
*   **frontend/**: Web Dashboard menggunakan React 19, Tailwind CSS 4 & Vite.
*   **pos_mobile/**: Aplikasi Mobile kasir menggunakan Flutter.

---

## 🚀 Panduan Instalasi

Pastikan Anda telah menginstal tools berikut di komputer Anda:
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
*   [PHP](https://www.php.net/) >= 8.2 & [Composer](https://getcomposer.org/)
*   [Node.js](https://nodejs.org/) & NPM
*   [Flutter SDK](https://flutter.dev/)
*   [MySQL](https://www.mysql.com/) Database

<<<<<<< HEAD
### 1. Backend Installation (Laravel)

The backend serves as the API provider for both Web and Mobile apps.

1.  Open a terminal and navigate to the `backend` folder:
=======
### 1. Instalasi Backend (Laravel)

Backend berfungsi sebagai penyedia API untuk Web dan Mobile.

1.  Buka terminal dan masuk ke folder `backend`:
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
    ```bash
    cd backend
    ```

<<<<<<< HEAD
2.  Install PHP dependencies using Composer:
=======
2.  Install dependensi PHP menggunakan Composer:
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
    ```bash
    composer install
    ```

<<<<<<< HEAD
3.  Copy the configuration file `.env`:
    ```bash
    cp .env.example .env
    ```
    *(On Windows, you can copy-paste the `.env.example` file and rename it to `.env`)*

4.  Generate the Application Key:
=======
3.  Salin file konfigurasi `.env`:
    ```bash
    cp .env.example .env
    ```
    *(Pada Windows, Anda bisa copy-paste file `.env.example` dan rename menjadi `.env`)*

4.  Generate Application Key:
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
    ```bash
    php artisan key:generate
    ```

<<<<<<< HEAD
5.  Database Configuration:
    Open the `.env` file and adjust your database connection settings:
=======
5.  Konfigurasi Database:
    Buka file `.env` dan sesuaikan koneksi database Anda:
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
<<<<<<< HEAD
    DB_DATABASE=pos_saas_db  # Make sure this database is created in MySQL
=======
    DB_DATABASE=pos_saas_db  # Pastikan database ini sudah dibuat di MySQL
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
    DB_USERNAME=root
    DB_PASSWORD=
    ```

<<<<<<< HEAD
6.  Run Database Migrations (to create tables):
=======
6.  Jalankan Migrasi Database (untuk membuat tabel):
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
    ```bash
    php artisan migrate
    ```

<<<<<<< HEAD
7.  Run the Backend Server:
    ```bash
    php artisan serve
    ```
    The server will run at `http://127.0.0.1:8000`.

---

### 2. Web Frontend Installation (React + Vite)

The Web Frontend is used by store owners/admins for management.

1.  Open a new terminal and navigate to the `frontend` folder:
=======
7.  Jalankan Server Backend:
    ```bash
    php artisan serve
    ```
    Server akan berjalan di `http://127.0.0.1:8000`.

---

### 2. Instalasi Frontend Web (React + Vite)

Frontend Web digunakan oleh pemilik toko/admin untuk manajemen.

1.  Buka terminal baru dan masuk ke folder `frontend`:
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
    ```bash
    cd frontend
    ```

<<<<<<< HEAD
2.  Install Node.js dependencies:
=======
2.  Install dependensi Node.js:
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
    ```bash
    npm install
    ```

<<<<<<< HEAD
3.  Run the Development Server:
    ```bash
    npm run dev
    ```
    The frontend will usually run at `http://localhost:5173`.

> **Note**: If you need to change the Backend API URL, check the source code configuration (usually in `src/api` or `src/config`) or the `.env` file if it exists.

---

### 3. Mobile App Installation (Flutter)

The Mobile App is used for cashier operations.

1.  Open a new terminal and navigate to the `pos_mobile` folder:
=======
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
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
    ```bash
    cd pos_mobile
    ```

<<<<<<< HEAD
2.  Install Flutter dependencies:
=======
2.  Install dependensi Flutter:
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
    ```bash
    flutter pub get
    ```

<<<<<<< HEAD
3.  Run the Application:
    Make sure an Android/iOS emulator is running or a physical device is connected.
=======
3.  Jalankan Aplikasi:
    Pastikan emulator Android/iOS sudah berjalan atau HP terhubung.
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755
    ```bash
    flutter run
    ```

<<<<<<< HEAD
> **Mobile API Configuration**:
> Ensure the mobile app connects to your computer's IP address if running on a physical device (use your LAN IP, e.g., `192.168.1.x`, instead of `localhost` or `127.0.0.1`). Check the API URL configuration in `lib/core/api_config.dart` or similar files.

---

## Key Features

*   **Multi-Tenant**: Supports multiple stores/tenants.
*   **Product & Stock Management**: Easily manage inventory.
*   **Cashier Transactions**: Fast and responsive Point of Sales.
*   **Reports**: Analyze sales and store performance.
*   **Payment Integration**: Supports payment gateways (Midtrans).

## License
=======
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
>>>>>>> 6da174fcb6380f068560ff384804adb96ac62755

[MIT License](LICENSE)
