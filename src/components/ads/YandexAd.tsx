import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSubscription } from '@/hooks/useSubscriptions';

interface YandexAdProps {
  blockId?: string;
  renderTo?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Яндекс.Директ рекламный блок
 * Показывает рекламу только для бесплатных пользователей
 */
const YandexAd = ({ 
  blockId, 
  renderTo,
  className = '',
  style = {}
}: YandexAdProps) => {
  const { user } = useAuth();
  const { data: subscription } = useUserSubscription();
  const adRef = useRef<HTMLDivElement>(null);
  const yandexId = import.meta.env.VITE_YANDEX_DIRECT_ID;
  const isPremium = subscription?.plan?.plan_type !== 'free' && subscription?.plan?.plan_type !== undefined;

  useEffect(() => {
    // Не показываем рекламу премиум пользователям
    if (isPremium || !yandexId || !blockId) {
      return;
    }

    // Загружаем Яндекс.Директ скрипт
    if (!document.querySelector('script[src*="yandex.ru/ads"]')) {
      const script = document.createElement('script');
      script.src = 'https://yandex.ru/ads/system/context.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Инициализируем рекламу
    if (adRef.current && (window as any).Ya) {
      try {
        (window as any).Ya.Context.AdvManager.render({
          blockId: blockId,
          renderTo: renderTo || adRef.current.id,
        });
      } catch (e) {
        console.error('Yandex Ad error:', e);
      }
    }
  }, [yandexId, blockId, renderTo, isPremium]);

  // Не показываем рекламу премиум пользователям
  if (isPremium) {
    return null;
  }

  if (!yandexId || !blockId) {
    return null;
  }

  const containerId = renderTo || `yandex-ad-${blockId}`;

  return (
    <div 
      id={containerId}
      ref={adRef}
      className={`yandex-ad-container ${className}`}
      style={style}
    />
  );
};

export default YandexAd;












