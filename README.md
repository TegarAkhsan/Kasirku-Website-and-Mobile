# POS SaaS Application
<img width="1920" height="929" alt="image" src="https://github.com/user-attachments/assets/0b2c9fd0-0593-4b93-b27c-905f88f32816" />

A complete SaaS-based Point of Sales (POS) application, consisting of a Backend (Laravel), Web Frontend (React), and Mobile Application (Flutter).

<img width="1920" height="928" alt="image" src="https://github.com/user-attachments/assets/53999946-d4e5-4da6-96b8-f8b3315e8f27" />

<img width="1920" height="927" alt="image" src="https://github.com/user-attachments/assets/0aa40502-92a7-446a-835b-33ebcd87d7bd" />
<img width="1916" height="928" alt="image" src="https://github.com/user-attachments/assets/8f77f707-ddf9-4219-9a07-2ed85d7f03d8" />

<img width="1920" height="928" alt="image" src="https://github.com/user-attachments/assets/632bfb1d-dead-4760-b6c7-301a7e067464" />

## Project Structure

The project consists of 3 main parts:
*   **backend/**: API Server using Laravel 12 & MySQL.
*   **frontend/**: Web Dashboard using React 19, Tailwind CSS 4 & Vite.
*   **pos_mobile/**: Cashier Mobile App using Flutter.

---

## 🚀 Installation Guide

Ensure you have the following tools installed on your computer:
*   [PHP](https://www.php.net/) >= 8.2 & [Composer](https://getcomposer.org/)
*   [Node.js](https://nodejs.org/) & NPM
*   [Flutter SDK](https://flutter.dev/)
*   [MySQL](https://www.mysql.com/) Database

### 1. Backend Installation (Laravel)

The backend serves as the API provider for both Web and Mobile apps.

1.  Open a terminal and navigate to the `backend` folder:
    ```bash
    cd backend
    ```

2.  Install PHP dependencies using Composer:
    ```bash
    composer install
    ```

3.  Copy the configuration file `.env`:
    ```bash
    cp .env.example .env
    ```
    *(On Windows, you can copy-paste the `.env.example` file and rename it to `.env`)*

4.  Generate the Application Key:
    ```bash
    php artisan key:generate
    ```

5.  Database Configuration:
    Open the `.env` file and adjust your database connection settings:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=pos_saas_db  # Make sure this database is created in MySQL
    DB_USERNAME=root
    DB_PASSWORD=
    ```

6.  Run Database Migrations (to create tables):
    ```bash
    php artisan migrate
    ```

7.  Run the Backend Server:
    ```bash
    php artisan serve
    ```
    The server will run at `http://127.0.0.1:8000`.

---

### 2. Web Frontend Installation (React + Vite)

The Web Frontend is used by store owners/admins for management.

1.  Open a new terminal and navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```

2.  Install Node.js dependencies:
    ```bash
    npm install
    ```

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
    ```bash
    cd pos_mobile
    ```

2.  Install Flutter dependencies:
    ```bash
    flutter pub get
    ```

3.  Run the Application:
    Make sure an Android/iOS emulator is running or a physical device is connected.
    ```bash
    flutter run
    ```

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

[MIT License](LICENSE)
