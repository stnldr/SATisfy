import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '@/components/auth/SignupForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-glow/5">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Присоединяйтесь к StudySAT
            </h1>
            <p className="text-muted-foreground">
              Создайте аккаунт для сохранения прогресса
            </p>
          </div>
          <SignupForm onSuccess={handleSuccess} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SignupPage;







