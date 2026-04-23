import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useSubscriptions';

interface SubscriptionGateProps {
  feature: 'unlimited_questions' | 'advanced_analytics' | 'priority_support' | 'all_lessons' | 'all_flashcards';
  children: ReactNode;
  fallback?: ReactNode;
  message?: string;
}

export const SubscriptionGate = ({
  feature,
  children,
  fallback,
  message,
}: SubscriptionGateProps) => {
  const { data: hasAccess, isLoading } = useFeatureAccess(feature);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const defaultMessage = message || 'Эта функция доступна только для премиум подписчиков';

  return (
    <Card className="border-accent">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-accent" />
          <CardTitle>Премиум функция</CardTitle>
        </div>
        <CardDescription>{defaultMessage}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Эта функция доступна только для премиум подписчиков.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};






