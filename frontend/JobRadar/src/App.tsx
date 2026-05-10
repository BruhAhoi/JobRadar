import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthStore } from './stores/useAuthStore';
import { Toaster } from 'sonner';

function App() {
  const { accessToken } = useAuthStore();
  return (
    <>
      <Toaster richColors/>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
