import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Shield, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || '');

  if (!user) {
    navigate('/');
    return null;
  }

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSave = () => {
    // Here you would typically update the user profile
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
          <p className="text-muted-foreground">
            Управление вашим аккаунтом и настройками
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/settings')}
          className="gap-2"
        >
          <Edit3 className="h-4 w-4" />
          Настройки
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Информация о профиле
            </CardTitle>
            <CardDescription>
              Основная информация о вашем аккаунте
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                <AvatarFallback className="text-lg">
                  {getInitials(user.email || '')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {user.user_metadata?.full_name || 'Пользователь'}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="secondary">
                  {user.email_confirmed_at ? 'Подтвержден' : 'Не подтвержден'}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Дата регистрации</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Последний вход</p>
                  <p className="text-sm text-muted-foreground">
                    {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Неизвестно'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Статистика обучения</CardTitle>
            <CardDescription>
              Ваш прогресс в изучении SAT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Всего вопросов</span>
                <span className="text-2xl font-bold text-primary">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Правильных ответов</span>
                <span className="text-2xl font-bold text-green-600">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Точность</span>
                <span className="text-2xl font-bold text-blue-600">0%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Время обучения</span>
                <span className="text-2xl font-bold text-purple-600">0ч</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Последняя активность</CardTitle>
          <CardDescription>
            Ваши недавние действия в системе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Пока нет активности</p>
            <p className="text-sm">Начните обучение, чтобы увидеть статистику</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;







