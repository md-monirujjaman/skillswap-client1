import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseTasks from "./pages/BrowseTasks";
import BrowseFreelancers from "./pages/BrowseFreelancers";
import FreelancerProfile from "./pages/FreelancerProfile";
import TaskDetails from "./pages/TaskDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import DummyCheckout from "./pages/DummyCheckout";
import ClientDashboard from "./pages/dashboards/ClientDashboard";
import FreelancerDashboard from "./pages/dashboards/FreelancerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

function AppContent() {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-sans tracking-tight">Loading...</div>;
  }

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return (
      <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#0a0f1d] transition-colors">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#0a0f1d] transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/tasks" element={<BrowseTasks />} />
          <Route path="/freelancers" element={<BrowseFreelancers />} />
          <Route path="/freelancers/:id" element={<FreelancerProfile />} />
          
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/payment/checkout" element={<DummyCheckout />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          
          <Route path="/dashboard/client/*" element={
            <ProtectedRoute allowedRoles={['Client']}><ClientDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/freelancer/*" element={
            <ProtectedRoute allowedRoles={['Freelancer']}><FreelancerDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/admin/*" element={
            <ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
