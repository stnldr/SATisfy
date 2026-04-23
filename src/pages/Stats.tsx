import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getQuizProgress, getBookmarks, exportProgress } from '@/lib/storage';
import { questions } from '@/data/database';
import { TrendingUp, Target, Bookmark, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const Stats = () => {
  const progress = getQuizProgress();
  const bookmarks = getBookmarks();
  
  const accuracy = progress.attempts > 0
    ? Math.round((progress.correct / progress.attempts) * 100)
    : 0;

  const recentHistory = progress.history.slice(-10).reverse();
  
  // Calculate stats by section
  const sectionStats = questions.reduce((acc, q) => {
    if (!acc[q.section]) {
      acc[q.section] = { total: 0, correct: 0 };
    }
    const attempts = progress.history.filter(h => h.qId === q.id);
    const correct = attempts.filter(h => h.correct).length;
    acc[q.section].total += attempts.length;
    acc[q.section].correct += correct;
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studysat-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Прогресс экспортирован!');
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'Reading': return 'bg-reading text-reading-foreground';
      case 'Math': return 'bg-math text-math-foreground';
      case 'Grammar': return 'bg-grammar text-grammar-foreground';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Статистика</h1>
          <p className="mt-2 text-muted-foreground">
            Отслеживайте свой прогресс и производительность
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Экспорт
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего попыток</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{progress.attempts}</div>
            <p className="text-xs text-muted-foreground">
              Вопросов отвечено
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Правильных</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{progress.correct}</div>
            <p className="text-xs text-muted-foreground">
              Верных ответов
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Точность</CardTitle>
            <RotateCcw className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              Процент правильных
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Закладки</CardTitle>
            <Bookmark className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{bookmarks.length}</div>
            <p className="text-xs text-muted-foreground">
              Сохраненных вопросов
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Производительность по секциям</CardTitle>
          <CardDescription>Ваша точность в каждой секции</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(sectionStats).map(([section, stats]) => {
              const sectionAccuracy = stats.total > 0
                ? Math.round((stats.correct / stats.total) * 100)
                : 0;
              
              return (
                <div key={section} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getSectionColor(section)}>{section}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {stats.correct} / {stats.total}
                      </span>
                    </div>
                    <span className="font-bold">{sectionAccuracy}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${sectionAccuracy}%` }}
                    />
                  </div>
                </div>
              );
            })}
            
            {Object.keys(sectionStats).length === 0 && (
              <p className="text-center text-muted-foreground">
                Пока нет данных. Начните практику, чтобы увидеть статистику!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Недавняя активность</CardTitle>
          <CardDescription>Последние 10 вопросов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentHistory.map((item, index) => {
              const question = questions.find(q => q.id === item.qId);
              if (!question) return null;
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3 transition-all hover:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      item.correct ? 'bg-success' : 'bg-destructive'
                    }`} />
                    <div>
                      <div className="font-medium">{question.section}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {question.question}
                      </div>
                    </div>
                  </div>
                  <Badge variant={item.correct ? 'default' : 'destructive'}>
                    {item.correct ? 'Правильно' : 'Неправильно'}
                  </Badge>
                </div>
              );
            })}
            
            {recentHistory.length === 0 && (
              <p className="text-center text-muted-foreground">
                Нет недавней активности
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bookmarked Questions */}
      {bookmarks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-accent" />
              Закладки
            </CardTitle>
            <CardDescription>Вопросы для повторения</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bookmarks.slice(0, 10).map((id) => {
                const question = questions.find(q => q.id === id);
                if (!question) return null;
                
                return (
                  <div
                    key={id}
                    className="rounded-lg border p-3 transition-all hover:border-primary"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <Badge className={getSectionColor(question.section)}>
                        {question.section}
                      </Badge>
                      <Badge variant="outline">{question.difficulty}</Badge>
                    </div>
                    <div className="text-sm">{question.question}</div>
                  </div>
                );
              })}
              {bookmarks.length > 10 && (
                <p className="pt-2 text-center text-sm text-muted-foreground">
                  И еще {bookmarks.length - 10} закладок...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Stats;
