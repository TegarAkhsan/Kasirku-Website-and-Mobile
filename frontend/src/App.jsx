import { Routes, Route, Navigate } from "react-router-dom";
import GuestLayout from "./layouts/GuestLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerProducts from "./pages/OwnerProducts";
import OwnerCashiers from "./pages/OwnerCashiers";
import OwnerStores from "./pages/OwnerStores";
import OwnerCategories from "./pages/OwnerCategories";
import OwnerSettings from "./pages/OwnerSettings";

import OwnerReports from "./pages/OwnerReports";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTenants from "./pages/AdminTenants";

import POS from "./pages/POS";
import PaymentPage from "./pages/PaymentPage";
import MockPayment from "./pages/MockPayment";
import ReceiptModal from "./components/ReceiptModal";
import HistoryPage from "./pages/HistoryPage";
import AppLayout from "./layouts/AppLayout";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route element={<GuestLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<AppLayout />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/products" element={<OwnerProducts />} />
          <Route path="/owner/categories" element={<OwnerCategories />} />
          <Route path="/owner/categories" element={<OwnerCategories />} />
          <Route path="/owner/users" element={<OwnerCashiers />} />
          <Route path="/owner/stores" element={<OwnerStores />} />
          <Route path="/owner/stores" element={<OwnerStores />} />
          <Route path="/owner/reports" element={<OwnerReports />} />
          <Route path="/owner/settings" element={<OwnerSettings />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/tenants" element={<AdminTenants />} />
          <Route path="/admin/packages" element={<div className="text-white p-8">Packages & Features Management (Coming Soon)</div>} />
          <Route path="/admin/transactions" element={<div className="text-white p-8">Global Transactions (Coming Soon)</div>} />
          <Route path="/admin/users" element={<div className="text-white p-8">User Admin Management (Coming Soon)</div>} />
          <Route path="/admin/monitoring" element={<div className="text-white p-8">System Monitoring (Coming Soon)</div>} />

          <Route path="/pos" element={<POS />} />
          <Route path="/pos/payment" element={<PaymentPage />} />
          <Route path="/mock-payment/:id" element={<MockPayment />} />
          <Route path="/pos/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
