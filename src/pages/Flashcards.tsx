import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { flashcards } from '@/data/database';
import { RotateCw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

const Flashcards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [shuffledCards, setShuffledCards] = useState(flashcards);

  const categories = ['Reading', 'Math', 'Grammar'];
  
  const filteredCards = selectedCategory
    ? shuffledCards.filter(card => card.category === selectedCategory)
    : shuffledCards;

  const currentCard = filteredCards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Reading': return 'bg-reading text-reading-foreground';
      case 'Math': return 'bg-math text-math-foreground';
      case 'Grammar': return 'bg-grammar text-grammar-foreground';
      default: return 'bg-muted';
    }
  };

  if (!currentCard) {
    return (
      <div className="text-center">
        <p className="text-lg text-muted-foreground">Нет доступных флеш-карт</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">Флеш-карты</h1>
        <p className="mt-2 text-muted-foreground">
          Изучайте ключевые термины и концепции
        </p>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedCategory(null);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
            >
              Все ({flashcards.length})
            </Button>
            {categories.map((category) => {
              const count = flashcards.filter(c => c.category === category).length;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                >
                  {category} ({count})
                </Button>
              );
            })}
            <Button variant="ghost" size="sm" onClick={handleShuffle} className="gap-2">
              <Shuffle className="h-4 w-4" />
              Перемешать
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Flashcard */}
      <div className="relative h-96 perspective-1000">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative h-full w-full cursor-pointer transition-transform duration-500 preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <Card
            className="absolute inset-0 flex items-center justify-center backface-hidden shadow-hover"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent className="space-y-4 text-center">
              <Badge className={getCategoryColor(currentCard.category)}>
                {currentCard.category}
              </Badge>
              <div className="text-3xl font-bold">{currentCard.term}</div>
              <div className="text-sm text-muted-foreground">
                Нажмите, чтобы увидеть определение
              </div>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            className="absolute inset-0 flex items-center justify-center rotate-y-180 backface-hidden shadow-hover"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <CardContent className="space-y-4 text-center">
              <Badge className={getCategoryColor(currentCard.category)}>
                Определение
              </Badge>
              <div className="text-xl leading-relaxed">{currentCard.definition}</div>
              <div className="text-sm text-muted-foreground">
                Нажмите, чтобы вернуться
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={filteredCards.length <= 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Предыдущая
            </Button>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Карта</div>
              <div className="text-2xl font-bold">
                {currentIndex + 1} / {filteredCards.length}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={filteredCards.length <= 1}
              className="gap-2"
            >
              Следующая
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hint */}
      <div className="text-center text-sm text-muted-foreground">
        💡 Совет: Используйте стрелки клавиатуры для навигации
      </div>
    </div>
  );
};

export default Flashcards;
