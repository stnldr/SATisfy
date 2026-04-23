import { useAuth } from '@/contexts/AuthContext';
import { useUserSubscription } from '@/hooks/useSubscriptions';
import { Card } from '@/components/ui/card';

interface AdPlaceholderProps {
  title?: string;
  description?: string;
  className?: string;
  height?: string;
}

/**
 * Заглушка для рекламы (для разработки или когда реклама не настроена)
 * Можно использовать для продажи рекламных мест напрямую
 */
const AdPlaceholder = ({ 
  title = 'Рекламное место',
  description = 'Здесь может быть ваша реклама',
  className = '',
  height = '250px'
}: AdPlaceholderProps) => {
  const { user } = useAuth();
  const { data: subscription } = useUserSubscription();
  const isPremium = subscription?.plan?.plan_type !== 'free' && subscription?.plan?.plan_type !== undefined;

  // Не показываем для премиум пользователей
  if (isPremium) {
    return null;
  }

  return (
    <Card className={`ad-placeholder ${className}`} style={{ minHeight: height }}>
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-sm font-medium text-muted-foreground mb-2">
          {title}
        </div>
        <div className="text-xs text-muted-foreground">
          {description}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Контакты для размещения: ads@studysat.kz
        </div>
      </div>
    </Card>
  );
};

export default AdPlaceholder;












