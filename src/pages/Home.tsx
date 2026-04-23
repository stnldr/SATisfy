import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, Clock, Trophy, Bookmark, TrendingUp, Loader2, FileQuestion } from 'lucide-react';
import { useQuizProgressHybrid, useBookmarksHybrid } from '@/lib/storage-hybrid';
import { useQuestions } from '@/hooks/useQuestions';
import { useLessons } from '@/hooks/useLessons';
import { useFlashcards } from '@/hooks/useFlashcards';
import AdBanner from '@/components/ads/AdBanner';
import AdPlaceholder from '@/components/ads/AdPlaceholder';

const Home = () => {
  const navigate = useNavigate();
  const { data: progress, isLoading: progressLoading } = useQuizProgressHybrid();
  const { data: bookmarks, isLoading: bookmarksLoading } = useBookmarksHybrid();
  const { data: questions, isLoading: questionsLoading } = useQuestions();
  const { data: lessons, isLoading: lessonsLoading } = useLessons();
  const { data: flashcards, isLoading: flashcardsLoading } = useFlashcards();
  
  const progressData = progress || { attempts: 0, correct: 0, history: [] };
  const bookmarksData = bookmarks || [];
  const questionsData = questions || [];
  const lessonsData = lessons || [];
  const flashcardsData = flashcards || [];
  
  const accuracy = progressData.attempts > 0 
    ? Math.round((progressData.correct / progressData.attempts) * 100) 
    : 0;

  const isLoading = progressLoading || bookmarksLoading;

  const stats = [
    { icon: Trophy, label: 'Правильных ответов', value: progressData.correct, color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/20', gradient: 'from-success/20 to-success/5' },
    { icon: TrendingUp, label: 'Точность', value: `${accuracy}%`, color: 'text-primary', bgColor: 'bg-primary/10', borderColor: 'border-primary/20', gradient: 'from-primary/20 to-primary/5' },
    { icon: BookOpen, label: 'Всего попыток', value: progressData.attempts, color: 'text-secondary', bgColor: 'bg-secondary/10', borderColor: 'border-secondary/20', gradient: 'from-secondary/20 to-secondary/5' },
    { icon: Bookmark, label: 'Закладки', value: bookmarksData.length, color: 'text-accent', bgColor: 'bg-accent/10', borderColor: 'border-accent/20', gradient: 'from-accent/20 to-accent/5' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative space-y-10 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-12 text-primary-foreground shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <h1 className="text-6xl font-semibold tracking-tight leading-none text-white drop-shadow-lg">
            Добро пожаловать в StudySAT
          </h1>
          <p className="text-xl text-white/90 leading-relaxed drop-shadow-md">
            Комплексная платформа для подготовки к SAT экзамену с расширенной базой вопросов, уроками и статистикой прогресса
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-3">
          <Button
            size="lg"
            onClick={() => navigate('/practice')}
            className="gap-2 h-12 px-6 text-base bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
          >
            <Brain className="h-4 w-4" />
            Начать практику
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/lessons')}
            className="gap-2 h-12 px-6 text-base border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <BookOpen className="h-4 w-4" />
            Изучить уроки
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/flashcards')}
            className="gap-2 h-12 px-6 text-base border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <Clock className="h-4 w-4" />
            Флеш-карты
          </Button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Stats Grid */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${stat.borderColor} bg-gradient-to-br ${stat.gradient} group`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2.5 rounded-lg ${stat.bgColor} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className={`text-4xl font-semibold ${stat.color} tracking-tight group-hover:scale-105 transition-transform duration-300`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              Режимы практики
            </CardTitle>
            <CardDescription className="mt-1">
              Выберите подходящий режим тренировки
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 relative z-10">
            <Button
              variant="outline"
              className="w-full justify-start h-10 transition-all hover:bg-primary/10 hover:border-primary/30 hover:shadow-md"
              onClick={() => navigate('/practice?mode=quick')}
            >
              Быстрая практика
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-10 transition-all hover:bg-primary/10 hover:border-primary/30 hover:shadow-md"
              onClick={() => navigate('/practice?mode=section')}
            >
              По секциям (Reading, Math, Grammar)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-10 transition-all hover:bg-primary/10 hover:border-primary/30 hover:shadow-md"
              onClick={() => navigate('/practice?mode=difficulty')}
            >
              По сложности (Easy, Medium, Hard)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-10 transition-all hover:bg-primary/10 hover:border-primary/30 hover:shadow-md"
              onClick={() => navigate('/practice?mode=timed')}
            >
              <Clock className="mr-2 h-4 w-4" />
              Тренировка с таймером
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Bookmark className="h-5 w-5 text-accent" />
              </div>
              Ваши закладки
            </CardTitle>
            <CardDescription className="mt-1">
              {isLoading ? 'Загрузка...' : bookmarksData.length === 0 ? 'Пока нет закладок' : `${bookmarksData.length} сохраненных вопросов`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : bookmarksData.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Отмечайте вопросы закладками во время практики, чтобы вернуться к ним позже
              </p>
            ) : (
              <div className="space-y-2">
                {bookmarksData.slice(0, 3).map((id) => {
                  const q = questionsData.find((q) => q.id === id);
                  if (!q) return null;
                  return (
                    <div
                      key={id}
                      className="rounded-lg border-2 border-border/50 p-4 text-sm transition-all hover:border-accent/50 hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br from-card to-muted/20 group"
                    >
                      <div className="font-medium text-foreground mb-1 group-hover:text-accent transition-colors">
                        {q.section} · {q.difficulty}
                      </div>
                      <div className="text-muted-foreground line-clamp-2 leading-relaxed">
                        {q.question}
                      </div>
                    </div>
                  );
                })}
                {bookmarksData.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/stats')}
                    className="w-full"
                  >
                    Показать все ({bookmarksData.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Database Stats */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 border-2 border-border/60">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-lg">База данных</CardTitle>
          <CardDescription>Количество доступных материалов</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center border-2 border-primary/20 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 group">
              {questionsLoading ? (
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
              ) : (
                <>
                  <div className="text-4xl font-semibold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">{questionsData.length}</div>
                  <div className="text-sm text-muted-foreground font-medium">Вопросов</div>
                </>
              )}
            </div>
            <div className="rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 text-center border-2 border-secondary/20 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-secondary/40 group">
              {flashcardsLoading ? (
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-secondary" />
              ) : (
                <>
                  <div className="text-4xl font-semibold text-secondary mb-2 group-hover:scale-110 transition-transform duration-300">{flashcardsData.length}</div>
                  <div className="text-sm text-muted-foreground font-medium">Флеш-карт</div>
                </>
              )}
            </div>
            <div className="rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 p-6 text-center border-2 border-accent/20 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-accent/40 group">
              {lessonsLoading ? (
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" />
              ) : (
                <>
                  <div className="text-4xl font-semibold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">{lessonsData.length}</div>
                  <div className="text-sm text-muted-foreground font-medium">Уроков</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Рекламный блок */}
      <div className="mt-8">
        <AdBanner 
          slotId={import.meta.env.VITE_ADSENSE_SLOT_HOME}
          format="horizontal"
          className="w-full"
        />
        {/* Если AdSense не настроен, показываем заглушку */}
        {!import.meta.env.VITE_GOOGLE_ADSENSE_ID && (
          <AdPlaceholder 
            title="Рекламное место"
            description="Здесь может быть ваша реклама"
            height="100px"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
