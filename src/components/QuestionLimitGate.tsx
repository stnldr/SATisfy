import { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Lock } from 'lucide-react';
import { useTodaysQuestionCount, useUserSubscription, useFeatureAccess } from '@/hooks/useSubscriptions';
import { SubscriptionGate } from './SubscriptionGate';

interface QuestionLimitGateProps {
  children: ReactNode;
}

export const QuestionLimitGate = ({ children }: QuestionLimitGateProps) => {
  const { data: todaysCount, isLoading: countLoading } = useTodaysQuestionCount();
  const { data: subscription } = useUserSubscription();
  const { data: hasUnlimitedAccess } = useFeatureAccess('unlimited_questions');

  if (countLoading) {
    return <>{children}</>;
  }

  const count = todaysCount || 0;
  const maxQuestions = 10; // Free plan limit
  const remaining = maxQuestions - count;

  // If user has unlimited access, show children directly
  if (hasUnlimitedAccess) {
    return <>{children}</>;
  }

  // If limit reached, show upgrade prompt
  if (count >= maxQuestions) {
    return (
      <Card className="border-accent">
        <CardContent className="pt-6">
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Дневной лимит достигнут</AlertTitle>
            <AlertDescription>
              Вы использовали все {maxQuestions} бесплатных вопросов сегодня. 
              Лимит обновится завтра.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show remaining questions warning if close to limit
  if (remaining <= 3 && remaining > 0) {
    return (
      <>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Осталось {remaining} из {maxQuestions} бесплатных вопросов сегодня.
          </AlertDescription>
        </Alert>
        {children}
      </>
    );
  }

  return <>{children}</>;
};






