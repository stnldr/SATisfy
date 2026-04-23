import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSubscription } from '@/hooks/useSubscriptions';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Google AdSense Banner Component
 * Показывает рекламу только для бесплатных пользователей
 */
const AdBanner = ({ 
  slotId, 
  format = 'auto',
  className = '',
  style = {}
}: AdBannerProps) => {
  const { user } = useAuth();
  const { data: subscription } = useUserSubscription();
  const adRef = useRef<HTMLDivElement>(null);
  const adSenseId = import.meta.env.VITE_GOOGLE_ADSENSE_ID;
  const isPremium = subscription?.plan?.plan_type !== 'free' && subscription?.plan?.plan_type !== undefined;

  useEffect(() => {
    // Не показываем рекламу премиум пользователям
    if (isPremium || !adSenseId || !slotId) {
      return;
    }

    // Загружаем AdSense скрипт
    if (!document.querySelector('script[src*="adsbygoogle"]')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Инициализируем рекламу
    if (adRef.current && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [adSenseId, slotId, isPremium]);

  // Не показываем рекламу премиум пользователям
  if (isPremium) {
    return null;
  }

  if (!adSenseId || !slotId) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adSenseId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;













