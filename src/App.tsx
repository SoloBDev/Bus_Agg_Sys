"use client";

import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/auth-context";
import { ThemeProvider } from "./components/theme-provider";
import { Sidebar } from "./components/sidebar";
import { TopNav } from "./components/top-nav";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";

// Import all your pages as before...
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import { SettingsProvider } from "./context/settings-context";
import SignupPage from "./pages/signup";
import AdminDashboardPage from "./pages/admin/dashboard";
import TenantDashboardPage from "./pages/tenant/dashboard";
import OperatorDashboardPage from "./pages/operator/dashboard";
import Registration from "./pages/register";
import AnalyticsDashboardPage from "./pages/tenant/tenant-analytics";
import BusesPage from "./pages/tenant/buses";
import BusRouteManagement from "./pages/tenant/bus-route-management";
import VerifyEmailPage from "./components/email-verfication";
import AdminConfigPage from "./pages/admin/config";
import AdminFinancesPage from "./pages/admin/finances";
import AdminSecurityPage from "./pages/admin/security";
import TenantsPage from "./pages/admin/tenants";
// ... (keep all your other page imports)

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

const MainLayout = () => {
  return (
    <div className='min-h-screen flex w-[100%] '>
      <Sidebar children={undefined} />
      <div className='flex flex-col'>
        <TopNav />
        <div className='mx-auto p-6'>
          <main className=''>
            <Outlet /> {/* This renders the matched child route */}
          </main>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme='dark'>
      <SettingsProvider>
        <TooltipProvider delayDuration={0}>
          <Routes>
            {/* Public routes without layout */}
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/register' element={<Registration />} />
            <Route path='/verify-email' element={<VerifyEmailPage />} />

            {/* Protected routes with layout */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["system_admin", "tenant_admin", "operator"]}
                >
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* System Admin routes */}
              <Route
                path='/admin/dashboard'
                element={
                  <ProtectedRoute allowedRoles={["system_admin"]}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/admin/analytics'
                element={
                  <ProtectedRoute allowedRoles={["system_admin"]}>
                    <AnalyticsDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/admin/config'
                element={
                  <ProtectedRoute allowedRoles={["system_admin"]}>
                    <AdminConfigPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/admin/finances'
                element={
                  <ProtectedRoute allowedRoles={["system_admin"]}>
                    <AdminFinancesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/admin/security'
                element={
                  <ProtectedRoute allowedRoles={["system_admin"]}>
                    <AdminSecurityPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/admin/tenants'
                element={
                  <ProtectedRoute allowedRoles={["system_admin"]}>
                    <TenantsPage />
                  </ProtectedRoute>
                }
              />
              {/* ... other admin routes */}

              {/* Tenant Admin routes */}
              <Route
                path='/tenant/dashboard'
                element={
                  <ProtectedRoute allowedRoles={["tenant_admin"]}>
                    <TenantDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/tenant/analytics'
                element={
                  <ProtectedRoute allowedRoles={["tenant_admin"]}>
                    <AnalyticsDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/tenant/buses'
                element={
                  <ProtectedRoute allowedRoles={["tenant_admin"]}>
                    <BusesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/tenant/routes'
                element={
                  <ProtectedRoute allowedRoles={["tenant_admin"]}>
                    <BusRouteManagement />
                  </ProtectedRoute>
                }
              />
              {/* ... other tenant routes */}

              {/* Operator routes */}
              <Route
                path='/operator/dashboard'
                element={
                  <ProtectedRoute allowedRoles={["operator"]}>
                    <OperatorDashboardPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback route */}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
          <Toaster />
        </TooltipProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
