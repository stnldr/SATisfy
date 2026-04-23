import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, CreditCard, X, Check, AlertCircle } from 'lucide-react';
import { useUserSubscription, useCancelSubscription } from '@/hooks/useSubscriptions';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

const Subscription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { data: subscription, isLoading } = useUserSubscription();
  const cancelMutation = useCancelSubscription();
  const queryClient = useQueryClient();

  // Handle success/cancel from Stripe Checkout
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      toast.success('Подписка успешно оформлена!');
      queryClient.invalidateQueries({ queryKey: ["userSubscription", user?.id] });
      // Clean URL
      navigate('/subscription', { replace: true });
    } else if (canceled === 'true') {
      toast.info('Оплата отменена');
      navigate('/subscription', { replace: true });
    }
  }, [searchParams, navigate, queryClient, user?.id]);


  const handleCancel = async () => {
    if (!window.confirm('Вы уверены, что хотите отменить подписку? Доступ сохранится до конца оплаченного периода.')) {
      return;
    }

    try {
      await cancelMutation.mutateAsync();
      toast.success('Подписка будет отменена в конце текущего периода');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Ошибка при отмене подписки');
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Пожалуйста, войдите в систему для просмотра подписки.
              <Button
                variant="link"
                className="p-0 h-auto ml-2"
                onClick={() => navigate('/auth/login')}
              >
                Войти
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Card>
          <CardHeader>
            <CardTitle>У вас нет активной подписки</CardTitle>
            <CardDescription>
              Вы используете бесплатный план.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const plan = subscription.plan;
  const periodEnd = new Date(subscription.current_period_end);
  const isCanceling = subscription.cancel_at_period_end;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Текущая подписка</CardTitle>
              <CardDescription>
                {plan?.name} план
              </CardDescription>
            </div>
            <Badge
              variant={subscription.status === 'active' ? 'default' : 'secondary'}
            >
              {subscription.status === 'active' ? 'Активна' : subscription.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Тарифный план
              </div>
              <div className="text-2xl font-bold">{plan?.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Статус
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-success" />
                <span>{subscription.status === 'active' ? 'Активна' : subscription.status}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Следующее продление
              </div>
              <div className="text-lg font-semibold">
                {format(periodEnd, 'dd MMMM yyyy')}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Стоимость
              </div>
              <div className="text-lg font-semibold">
                ${plan?.price_monthly}/месяц
              </div>
            </div>
          </div>

          {/* Cancel Warning */}
          {isCanceling && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ваша подписка будет отменена {format(periodEnd, 'dd MMMM yyyy')}.
                Доступ к премиум функциям сохранится до этой даты.
              </AlertDescription>
            </Alert>
          )}

          {/* Features */}
          {plan?.features && plan.features.length > 0 && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-3">
                Включенные функции
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          {!isCanceling && (
            <div className="flex gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отмена...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Отменить подписку
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription History */}
      <Card>
        <CardHeader>
          <CardTitle>История подписки</CardTitle>
          <CardDescription>
            Просмотр истории изменений подписки
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            История подписки будет доступна после интеграции с платежной системой.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscription;

