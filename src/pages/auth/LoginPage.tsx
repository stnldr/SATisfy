import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-glow/5">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Добро пожаловать в StudySAT
            </h1>
            <p className="text-muted-foreground">
              Войдите в свой аккаунт для продолжения
            </p>
          </div>
          <LoginForm onSuccess={handleSuccess} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default LoginPage;







