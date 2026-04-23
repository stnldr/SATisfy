import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { lessons, Lesson } from '@/data/database';
import { BookOpen, Search, Play } from 'lucide-react';

const Lessons = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Reading', 'Math', 'Grammar', 'Strategy'];
  
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || lesson.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Reading': return 'bg-reading text-reading-foreground';
      case 'Math': return 'bg-math text-math-foreground';
      case 'Grammar': return 'bg-grammar text-grammar-foreground';
      case 'Strategy': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Уроки</h1>
          <p className="mt-2 text-muted-foreground">
            Изучайте ключевые концепции и стратегии для SAT
          </p>
        </div>
        <BookOpen className="h-12 w-12 text-primary opacity-20" />
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Поиск уроков..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Все
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredLessons.map((lesson) => (
          <Card
            key={lesson.id}
            className="group transition-all hover:scale-[1.02] hover:shadow-hover"
          >
            <CardHeader>
              <div className="mb-2">
                <Badge className={getCategoryColor(lesson.category)}>
                  {lesson.category}
                </Badge>
              </div>
              <CardTitle className="line-clamp-2">{lesson.title}</CardTitle>
              <CardDescription className="line-clamp-3">{lesson.body}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate(`/practice?mode=section&section=${lesson.category}`)}
                className="w-full gap-2"
                variant="outline"
              >
                <Play className="h-4 w-4" />
                Практиковать {lesson.category}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground">
              Уроки не найдены. Попробуйте изменить фильтры.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle>Статистика уроков</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            {categories.map((category) => {
              const count = lessons.filter(l => l.category === category).length;
              return (
                <div key={category} className="text-center">
                  <div className="text-3xl font-bold text-primary">{count}</div>
                  <div className="text-sm text-muted-foreground">{category}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Lessons;
