import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Question } from '@/data/database';
import { useQuestions, useQuestionsBySection, useQuestionsByDifficulty } from '@/hooks/useQuestions';
import { useSaveQuizProgressHybrid, useToggleBookmarkHybrid, useIsBookmarkedHybrid } from '@/lib/storage-hybrid';
import { Bookmark, BookmarkCheck, Clock, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { QuestionLimitGate } from '@/components/QuestionLimitGate';
import AdBanner from '@/components/ads/AdBanner';
import AdPlaceholder from '@/components/ads/AdPlaceholder';

const Practice = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'quick';
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  // Fetch questions based on mode
  const section = searchParams.get('section');
  const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | null;
  
  const allQuestionsQuery = useQuestions();
  const sectionQuestionsQuery = useQuestionsBySection(section as Question['section']);
  const difficultyQuestionsQuery = useQuestionsByDifficulty(difficulty!);
  
  const questionsData = useMemo(() => {
    if (mode === 'section' && section) {
      return sectionQuestionsQuery.data || [];
    } else if (mode === 'difficulty' && difficulty) {
      return difficultyQuestionsQuery.data || [];
    }
    return allQuestionsQuery.data || [];
  }, [mode, section, difficulty, allQuestionsQuery.data, sectionQuestionsQuery.data, difficultyQuestionsQuery.data]);

  const isLoading = mode === 'section' 
    ? sectionQuestionsQuery.isLoading 
    : mode === 'difficulty' 
    ? difficultyQuestionsQuery.isLoading 
    : allQuestionsQuery.isLoading;

  // Shuffle questions once loaded
  const questionPool = useMemo(() => {
    if (!questionsData.length) return [];
    return [...questionsData].sort(() => Math.random() - 0.5);
  }, [questionsData]);

  const saveProgressMutation = useSaveQuizProgressHybrid();
  const toggleBookmarkMutation = useToggleBookmarkHybrid();

  // Get current question for bookmark hook (only when questionPool has items)
  const currentQuestion = questionPool.length > 0 && currentIndex < questionPool.length 
    ? questionPool[currentIndex] 
    : null;
  const { data: isBookmarked } = useIsBookmarkedHybrid(currentQuestion?.id ?? 0);
  const isBookmarkedValue = isBookmarked ?? false;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (questionPool.length === 0 && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Выберите режим практики</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => navigate('/practice?mode=quick')} className="w-full">
            Быстрая практика
          </Button>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button variant="outline" onClick={() => navigate('/practice?mode=section&section=Reading')}>
              Reading
            </Button>
            <Button variant="outline" onClick={() => navigate('/practice?mode=section&section=Math')}>
              Math
            </Button>
            <Button variant="outline" onClick={() => navigate('/practice?mode=section&section=Grammar')}>
              Grammar
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button variant="outline" onClick={() => navigate('/practice?mode=difficulty&difficulty=easy')}>
              Easy
            </Button>
            <Button variant="outline" onClick={() => navigate('/practice?mode=difficulty&difficulty=medium')}>
              Medium
            </Button>
            <Button variant="outline" onClick={() => navigate('/practice?mode=difficulty&difficulty=hard')}>
              Hard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentIndex >= questionPool.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Практика завершена!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">{sessionStats.correct}/{sessionStats.total}</div>
            <div className="mt-2 text-lg text-muted-foreground">
              Точность: {Math.round((sessionStats.correct / sessionStats.total) * 100)}%
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/practice')} className="flex-1">
              Новая практика
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
              На главную
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / questionPool.length) * 100;

  const handleAnswer = async (answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === currentQuestion.answer;
    
    if (isCorrect) {
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
      toast.success('Правильно!');
    } else {
      setSessionStats(prev => ({ ...prev, total: prev.total + 1 }));
      toast.error('Неправильно');
    }
    
    // Save progress to Supabase or localStorage
    try {
      await saveProgressMutation.mutateAsync({
        questionId: currentQuestion.id,
        isCorrect,
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleBookmark = async () => {
    try {
      const isAdded = await toggleBookmarkMutation.mutateAsync(currentQuestion.id);
      toast.success(isAdded ? 'Добавлено в закладки' : 'Удалено из закладок');
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Ошибка при сохранении закладки');
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'Reading': return 'bg-reading text-reading-foreground';
      case 'Math': return 'bg-math text-math-foreground';
      case 'Grammar': return 'bg-grammar text-grammar-foreground';
      default: return 'bg-muted';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success';
      case 'medium': return 'bg-accent';
      case 'hard': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <QuestionLimitGate>
        {/* Progress Bar */}
        <Card>
        <CardContent className="pt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="font-medium">{currentIndex + 1} / {questionPool.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="shadow-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge className={getSectionColor(currentQuestion.section)}>
                {currentQuestion.section}
              </Badge>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              disabled={toggleBookmarkMutation.isPending}
            >
              {isBookmarkedValue ? (
                <BookmarkCheck className="h-5 w-5 text-accent" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          </div>
          <CardTitle className="mt-4 text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.answer;
            const showCorrect = showExplanation && isCorrect;
            const showWrong = showExplanation && isSelected && !isCorrect;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showExplanation}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] disabled:cursor-not-allowed ${
                  showCorrect
                    ? 'border-success bg-success/10 text-success'
                    : showWrong
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                    showCorrect
                      ? 'bg-success text-success-foreground'
                      : showWrong
                      ? 'bg-destructive text-destructive-foreground'
                      : isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            );
          })}

          {showExplanation && (
            <div className="animate-in fade-in slide-in-from-bottom-4 rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
              <div className="mb-2 font-semibold text-primary">Объяснение:</div>
              <p className="text-sm leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}

          {showExplanation && (
            <Button onClick={handleNext} className="w-full gap-2" size="lg">
              {currentIndex < questionPool.length - 1 ? (
                <>
                  Следующий вопрос
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Завершить
                  <RotateCcw className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
      </QuestionLimitGate>

      {/* Рекламный блок - показывается после каждого 5-го вопроса */}
      {currentIndex > 0 && currentIndex % 5 === 0 && (
        <div className="mt-6">
          <AdBanner 
            slotId={import.meta.env.VITE_ADSENSE_SLOT_PRACTICE}
            format="horizontal"
            className="w-full"
          />
          {!import.meta.env.VITE_GOOGLE_ADSENSE_ID && (
            <AdPlaceholder 
              title="Рекламное место"
              description="Здесь может быть ваша реклама"
              height="100px"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Practice;
