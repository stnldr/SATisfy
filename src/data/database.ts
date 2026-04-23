// Расширенная база данных для SAT подготовки

export interface Lesson {
  id: string;
  title: string;
  body: string;
  category: 'Reading' | 'Math' | 'Grammar' | 'Strategy';
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  category: 'Reading' | 'Math' | 'Grammar';
}

export interface Question {
  id: number;
  section: 'Reading' | 'Math' | 'Grammar';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const lessons: Lesson[] = [
  // Reading Lessons
  { 
    id: 'reading-1', 
    title: 'Reading: Стратегии чтения', 
    body: 'Как быстро находить главную мысль, контекстные подсказки и взаимодействовать с вопросами. Используйте метод предварительного просмотра: сначала читайте вопросы, затем текст.',
    category: 'Reading'
  },
  { 
    id: 'reading-2', 
    title: 'Reading: Работа с доказательствами', 
    body: 'Как находить текстовые доказательства для подтверждения ответов. Всегда ищите конкретные цитаты или примеры в тексте.',
    category: 'Reading'
  },
  { 
    id: 'reading-3', 
    title: 'Reading: Анализ тона и точки зрения', 
    body: 'Определение авторского тона, точки зрения и намерений. Обращайте внимание на выбор слов и риторические приемы.',
    category: 'Reading'
  },
  { 
    id: 'reading-4', 
    title: 'Reading: Словарь в контексте', 
    body: 'Как определять значение незнакомых слов из контекста. Ищите подсказки в окружающих предложениях.',
    category: 'Reading'
  },
  { 
    id: 'reading-5', 
    title: 'Reading: Структура текста', 
    body: 'Понимание того, как организован текст: причинно-следственные связи, сравнение, хронология, и проблема-решение.',
    category: 'Reading'
  },
  
  // Grammar/Writing Lessons
  { 
    id: 'grammar-1', 
    title: 'Writing: Пунктуация и согласование', 
    body: 'Правила использования запятых, точки с запятой, тире. Согласование подлежащего и сказуемого.',
    category: 'Grammar'
  },
  { 
    id: 'grammar-2', 
    title: 'Writing: Параллелизм', 
    body: 'Как создавать грамматически параллельные структуры в списках и сравнениях.',
    category: 'Grammar'
  },
  { 
    id: 'grammar-3', 
    title: 'Writing: Модификаторы', 
    body: 'Правильное размещение модификаторов, избегание висячих и неуместных модификаторов.',
    category: 'Grammar'
  },
  { 
    id: 'grammar-4', 
    title: 'Writing: Краткость и ясность', 
    body: 'Как писать ясно и лаконично, избегая избыточности и многословия.',
    category: 'Grammar'
  },
  { 
    id: 'grammar-5', 
    title: 'Writing: Переходы', 
    body: 'Использование переходных слов и фраз для создания логической связности.',
    category: 'Grammar'
  },
  
  // Math Lessons
  { 
    id: 'math-1', 
    title: 'Math: Алгебра и функции', 
    body: 'Линейные уравнения, системы уравнений, квадратичные функции и их графики. Основы работы с переменными.',
    category: 'Math'
  },
  { 
    id: 'math-2', 
    title: 'Math: Геометрия', 
    body: 'Углы, треугольники, площади, объемы, подобие и конгруэнтность.',
    category: 'Math'
  },
  { 
    id: 'math-3', 
    title: 'Math: Статистика и анализ данных', 
    body: 'Среднее, медиана, мода, стандартное отклонение, интерпретация графиков и диаграмм.',
    category: 'Math'
  },
  { 
    id: 'math-4', 
    title: 'Math: Тригонометрия', 
    body: 'Синус, косинус, тангенс, единичная окружность, и тригонометрические тождества.',
    category: 'Math'
  },
  { 
    id: 'math-5', 
    title: 'Math: Решение задач', 
    body: 'Стратегии решения сложных математических задач: работа в обратном направлении, подстановка чисел, исключение.',
    category: 'Math'
  },
  
  // Strategy Lessons
  { 
    id: 'strategy-1', 
    title: 'Тайм-менеджмент на экзамене', 
    body: 'Как распределять время между секциями и вопросами. Когда пропускать сложные вопросы и возвращаться к ним позже.',
    category: 'Strategy'
  },
  { 
    id: 'strategy-2', 
    title: 'Стратегии угадывания', 
    body: 'Как максимизировать шансы при угадывании: исключение неправильных ответов, распознавание паттернов.',
    category: 'Strategy'
  },
  { 
    id: 'strategy-3', 
    title: 'Подготовка в день экзамена', 
    body: 'Что взять с собой, как настроиться психологически, важность сна и правильного питания.',
    category: 'Strategy'
  },
];

export const flashcards: Flashcard[] = [
  // Math Flashcards
  { id: 'f1', term: 'Pythagorean theorem', definition: 'В прямоугольном треугольнике a² + b² = c², где c - гипотенуза.', category: 'Math' },
  { id: 'f2', term: 'Mean (среднее)', definition: 'Сумма всех чисел, деленная на их количество.', category: 'Math' },
  { id: 'f3', term: 'Median (медиана)', definition: 'Среднее значение в упорядоченном наборе данных.', category: 'Math' },
  { id: 'f4', term: 'Mode (мода)', definition: 'Наиболее часто встречающееся значение в наборе данных.', category: 'Math' },
  { id: 'f5', term: 'Parallel lines', definition: 'Прямые, которые никогда не пересекаются и находятся на одинаковом расстоянии друг от друга.', category: 'Math' },
  { id: 'f6', term: 'Perpendicular lines', definition: 'Прямые, пересекающиеся под прямым углом (90°).', category: 'Math' },
  { id: 'f7', term: 'Slope', definition: 'Крутизна линии, вычисляется как (y₂-y₁)/(x₂-x₁).', category: 'Math' },
  { id: 'f8', term: 'Y-intercept', definition: 'Точка, где линия пересекает ось Y (когда x=0).', category: 'Math' },
  { id: 'f9', term: 'Quadratic formula', definition: 'x = (-b ± √(b²-4ac)) / 2a для уравнения ax² + bx + c = 0.', category: 'Math' },
  { id: 'f10', term: 'Area of circle', definition: 'A = πr², где r - радиус.', category: 'Math' },
  { id: 'f11', term: 'Circumference', definition: 'C = 2πr или C = πd, где d - диаметр.', category: 'Math' },
  { id: 'f12', term: 'Volume of cylinder', definition: 'V = πr²h, где h - высота.', category: 'Math' },
  
  // Reading Flashcards
  { id: 'f13', term: 'Main idea', definition: 'Главная мысль или центральная тема абзаца или всего текста.', category: 'Reading' },
  { id: 'f14', term: 'Inference', definition: 'Вывод, основанный на доказательствах и рассуждениях, а не прямо указанный.', category: 'Reading' },
  { id: 'f15', term: 'Context clues', definition: 'Подсказки в окружающем тексте, помогающие определить значение слова.', category: 'Reading' },
  { id: 'f16', term: 'Hypothesis', definition: 'Предположение или теория, которую можно проверить.', category: 'Reading' },
  { id: 'f17', term: 'Synthesis', definition: 'Объединение информации из нескольких источников для формирования нового понимания.', category: 'Reading' },
  { id: 'f18', term: 'Tone', definition: 'Отношение автора к предмету, выраженное через выбор слов.', category: 'Reading' },
  { id: 'f19', term: 'Point of view', definition: 'Перспектива, с которой рассказывается история (1-е лицо, 3-е лицо и т.д.).', category: 'Reading' },
  { id: 'f20', term: 'Rhetoric', definition: 'Искусство эффективного или убедительного говорения или письма.', category: 'Reading' },
  
  // Grammar Flashcards
  { id: 'f21', term: 'Subject-verb agreement', definition: 'Подлежащее и глагол должны согласовываться по числу (единственное/множественное).', category: 'Grammar' },
  { id: 'f22', term: 'Comma splice', definition: 'Ошибка: два независимых предложения соединены только запятой.', category: 'Grammar' },
  { id: 'f23', term: 'Run-on sentence', definition: 'Два независимых предложения соединены без знаков препинания.', category: 'Grammar' },
  { id: 'f24', term: 'Dangling modifier', definition: 'Модификатор, который не имеет четкого объекта модификации.', category: 'Grammar' },
  { id: 'f25', term: 'Parallelism', definition: 'Использование одинаковой грамматической структуры в списках или сравнениях.', category: 'Grammar' },
  { id: 'f26', term: 'Active voice', definition: 'Подлежащее выполняет действие: "Кот поймал мышь".', category: 'Grammar' },
  { id: 'f27', term: 'Passive voice', definition: 'Подлежащее получает действие: "Мышь была поймана котом".', category: 'Grammar' },
  { id: 'f28', term: 'Transition words', definition: 'Слова, связывающие идеи: однако, более того, следовательно, например.', category: 'Grammar' },
];

export const questions: Question[] = [
  // ===== READING QUESTIONS (easy, medium, hard) =====
  
  // Easy Reading
  { 
    id: 101, 
    section: 'Reading', 
    difficulty: 'easy', 
    question: 'Какой тон выражается фразой "Despite the optimism..."?', 
    options: ['Пессимистичный', 'Оптимистичный', 'Нейтральный', 'Саркастический'], 
    answer: 0, 
    explanation: 'Фраза "Despite..." вводит контраст и обычно смещает тон к сомнению или пессимизму.' 
  },
  { 
    id: 102, 
    section: 'Reading', 
    difficulty: 'easy', 
    question: 'Что означает слово "inherent" в контексте: "An inherent quality of water"?', 
    options: ['Временный', 'Присущий', 'Внешний', 'Приобретенный'], 
    answer: 1, 
    explanation: 'Inherent означает "присущий" — качество, являющееся неотъемлемой частью.' 
  },
  { 
    id: 103, 
    section: 'Reading', 
    difficulty: 'easy', 
    question: 'Что обычно означает "main idea"?', 
    options: ['Деталь', 'Главная мысль', 'Пример', 'Определение'], 
    answer: 1, 
    explanation: 'Main idea — центральная или главная мысль текста.' 
  },
  { 
    id: 104, 
    section: 'Reading', 
    difficulty: 'easy', 
    question: 'В предложении "She was elated by the news" слово "elated" означает:', 
    options: ['Расстроенная', 'Обрадованная', 'Удивленная', 'Разозленная'], 
    answer: 1, 
    explanation: 'Elated означает очень счастливая или обрадованная.' 
  },
  { 
    id: 105, 
    section: 'Reading', 
    difficulty: 'easy', 
    question: 'Какая цель у вводного абзаца в эссе?', 
    options: ['Подвести итоги', 'Представить тему', 'Привести доказательства', 'Сделать вывод'], 
    answer: 1, 
    explanation: 'Вводный абзац представляет тему и часто содержит тезисное утверждение.' 
  },
  
  // Medium Reading
  { 
    id: 106, 
    section: 'Reading', 
    difficulty: 'medium', 
    question: 'Как автор поддерживает основной аргумент в параграфе 3?', 
    options: ['Через статистику', 'Через анекдот', 'Через ссылку на эксперта', 'Через риторический вопрос'], 
    answer: 2, 
    explanation: 'Автор цитирует исследование и мнение эксперта для подтверждения своего тезиса.' 
  },
  { 
    id: 107, 
    section: 'Reading', 
    difficulty: 'medium', 
    question: 'В контексте "The policy was ineffectual", что означает ineffectual?', 
    options: ['Эффективный', 'Неэффективный', 'Необходимый', 'Популярный'], 
    answer: 1, 
    explanation: 'Ineffectual означает неспособный произвести желаемый эффект.' 
  },
  { 
    id: 108, 
    section: 'Reading', 
    difficulty: 'medium', 
    question: 'Какой риторический прием используется: "Ask not what your country can do for you..."?', 
    options: ['Метафора', 'Хиазм', 'Гипербола', 'Аллитерация'], 
    answer: 1, 
    explanation: 'Это хиазм — инверсия структуры во втором предложении для эффекта.' 
  },
  { 
    id: 109, 
    section: 'Reading', 
    difficulty: 'medium', 
    question: 'Если автор описывает исследование, но затем говорит "However, critics argue...", какова его цель?', 
    options: ['Подорвать исследование', 'Показать баланс', 'Игнорировать критику', 'Согласиться с критиками'], 
    answer: 1, 
    explanation: 'Автор показывает обе стороны аргумента для сбалансированного представления.' 
  },
  { 
    id: 110, 
    section: 'Reading', 
    difficulty: 'medium', 
    question: 'В тексте автор использует много вопросов. Это пример:', 
    options: ['Риторических вопросов', 'Буквальных вопросов', 'Гипотетических сценариев', 'Сравнения'], 
    answer: 0, 
    explanation: 'Риторические вопросы используются для эффекта, не ожидая ответа.' 
  },
  
  // Hard Reading
  { 
    id: 111, 
    section: 'Reading', 
    difficulty: 'hard', 
    question: 'Какой тип аргументации использован, если автор приводит контраргумент и опровергает его?', 
    options: ['Ad hominem', 'Strawman', 'Refutation', 'Slippery slope'], 
    answer: 2, 
    explanation: 'Это рефутация (refutation) — автор представляет и опровергает контраргумент.' 
  },
  { 
    id: 112, 
    section: 'Reading', 
    difficulty: 'hard', 
    question: 'Автор использует аналогию между правительством и семьей. Это усиливает аргумент через:', 
    options: ['Логический довод', 'Эмоциональную привлекательность', 'Этическое доверие', 'Статистические данные'], 
    answer: 1, 
    explanation: 'Аналогии часто апеллируют к эмоциям, делая абстрактные идеи более понятными.' 
  },
  { 
    id: 113, 
    section: 'Reading', 
    difficulty: 'hard', 
    question: 'Какова функция последнего абзаца, если он повторяет тему из введения?', 
    options: ['Вводит новую идею', 'Создает замкнутую структуру', 'Противоречит тезису', 'Дает дополнительные факты'], 
    answer: 1, 
    explanation: 'Повторение темы создает связную, замкнутую структуру эссе.' 
  },
  { 
    id: 114, 
    section: 'Reading', 
    difficulty: 'hard', 
    question: 'Текст сравнивает две теории без выбора одной. Это пример:', 
    options: ['Аргументации', 'Синтеза', 'Повествования', 'Описания'], 
    answer: 1, 
    explanation: 'Синтез объединяет разные идеи или теории без обязательного выбора одной.' 
  },
  { 
    id: 115, 
    section: 'Reading', 
    difficulty: 'hard', 
    question: 'Автор цитирует противоположные мнения и находит общее. Это:', 
    options: ['Компромисс', 'Конфликт', 'Противоречие', 'Отклонение'], 
    answer: 0, 
    explanation: 'Нахождение общего между противоположными взглядами — это компромисс.' 
  },
  
  // ===== GRAMMAR QUESTIONS =====
  
  // Easy Grammar
  { 
    id: 201, 
    section: 'Grammar', 
    difficulty: 'easy', 
    question: 'Выберите правильную форму: "Each of the students ___ finished."', 
    options: ['have', 'has', 'are', 'were'], 
    answer: 1, 
    explanation: '"Each" требует единственного числа, поэтому правильный ответ "has".' 
  },
  { 
    id: 202, 
    section: 'Grammar', 
    difficulty: 'easy', 
    question: 'Выберите корректный вариант: "There ___ many reasons."', 
    options: ['is', 'are', 'was', 'been'], 
    answer: 1, 
    explanation: '"Many reasons" — множественное число, требует "are".' 
  },
  { 
    id: 203, 
    section: 'Grammar', 
    difficulty: 'easy', 
    question: 'Какой знак препинания нужен: "She went to the store ___ she bought milk."', 
    options: [', and', ', but', '; and', ': and'], 
    answer: 0, 
    explanation: 'Запятая с союзом "and" соединяет два независимых предложения.' 
  },
  { 
    id: 204, 
    section: 'Grammar', 
    difficulty: 'easy', 
    question: 'Выберите правильное местоимение: "___ book is on the table."', 
    options: ['His', 'Him', 'He', 'They'], 
    answer: 0, 
    explanation: 'Притяжательное местоимение "His" показывает принадлежность.' 
  },
  { 
    id: 205, 
    section: 'Grammar', 
    difficulty: 'easy', 
    question: 'Какое предложение правильное?', 
    options: ['Me and John went', 'John and I went', 'John and me went', 'I and John went'], 
    answer: 1, 
    explanation: '"John and I" правильно, так как "I" — подлежащее.' 
  },
  
  // Medium Grammar
  { 
    id: 206, 
    section: 'Grammar', 
    difficulty: 'medium', 
    question: 'Выберите корректную пунктуацию: "I went to the store ___ I bought milk."', 
    options: [', and', '; and', ': and', ' — and'], 
    answer: 1, 
    explanation: 'Точка с запятой соединяет тесно связанные независимые предложения.' 
  },
  { 
    id: 207, 
    section: 'Grammar', 
    difficulty: 'medium', 
    question: 'Исправьте: "Running quickly, the finish line was crossed by Sarah."', 
    options: ['Оставить как есть', 'Running quickly, Sarah crossed the finish line', 'The finish line, running quickly, was crossed', 'Sarah running quickly crossed'], 
    answer: 1, 
    explanation: 'Нужно избежать висячего модификатора: подлежащее должно следовать сразу за модификатором.' 
  },
  { 
    id: 208, 
    section: 'Grammar', 
    difficulty: 'medium', 
    question: 'Какое предложение демонстрирует параллелизм?', 
    options: ['She likes reading, to swim, and biking', 'She likes reading, swimming, and biking', 'She likes to read, swimming, and bikes', 'She likes read, swim, and bike'], 
    answer: 1, 
    explanation: 'Параллельная структура использует одинаковые грамматические формы (gerunds).' 
  },
  { 
    id: 209, 
    section: 'Grammar', 
    difficulty: 'medium', 
    question: 'Выберите правильное: "Neither the students nor the teacher ___ present."', 
    options: ['were', 'was', 'are', 'is'], 
    answer: 1, 
    explanation: 'С "neither...nor" глагол согласуется с ближайшим существительным (teacher — единственное число).' 
  },
  { 
    id: 210, 
    section: 'Grammar', 
    difficulty: 'medium', 
    question: 'Что лучше: "Due to the fact that" или "Because"?', 
    options: ['Due to the fact that', 'Because', 'Оба равны', 'Зависит от контекста'], 
    answer: 1, 
    explanation: '"Because" более лаконично и предпочтительно для ясности.' 
  },
  
  // Hard Grammar
  { 
    id: 211, 
    section: 'Grammar', 
    difficulty: 'hard', 
    question: 'Исправьте: "The committee were divided in their opinion."', 
    options: ['Оставить как есть', 'The committee was divided', 'The committees were divided', 'The committee have divided'], 
    answer: 1, 
    explanation: 'Коллективное существительное в американском английском обычно единственного числа.' 
  },
  { 
    id: 212, 
    section: 'Grammar', 
    difficulty: 'hard', 
    question: 'Какое использование двоеточия правильное?', 
    options: ['I need: milk, eggs, bread', 'I need three things: milk, eggs, and bread', 'The store has: many options', 'She said: hello'], 
    answer: 1, 
    explanation: 'Двоеточие вводит список после полного независимого предложения.' 
  },
  { 
    id: 213, 
    section: 'Grammar', 
    difficulty: 'hard', 
    question: 'Выберите лучший вариант: "The reason is because" или "The reason is that"?', 
    options: ['The reason is because', 'The reason is that', 'Оба правильны', 'Ни один не правилен'], 
    answer: 1, 
    explanation: '"The reason is that" грамматически правильно; "because" избыточно.' 
  },
  { 
    id: 214, 
    section: 'Grammar', 
    difficulty: 'hard', 
    question: 'Определите ошибку: "Between you and I, this is wrong."', 
    options: ['Between → Among', 'you → your', 'I → me', 'Нет ошибки'], 
    answer: 2, 
    explanation: 'После предлога нужно объектное местоимение "me", а не "I".' 
  },
  { 
    id: 215, 
    section: 'Grammar', 
    difficulty: 'hard', 
    question: 'Какое предложение использует субъюнктив правильно?', 
    options: ['I wish I was taller', 'If I was rich', 'I suggest he goes', 'I insist that she be present'], 
    answer: 3, 
    explanation: 'Субъюнктив использует базовую форму глагола (be) после определенных глаголов (insist, suggest).' 
  },
  
  // ===== MATH QUESTIONS =====
  
  // Easy Math
  { 
    id: 301, 
    section: 'Math', 
    difficulty: 'easy', 
    question: 'Если 2x + 3 = 11, чему равно x?', 
    options: ['3', '4', '5', '6'], 
    answer: 1, 
    explanation: '2x = 11 - 3 = 8, следовательно x = 4.' 
  },
  { 
    id: 302, 
    section: 'Math', 
    difficulty: 'easy', 
    question: 'Произведение 7 и 8 равно?', 
    options: ['54', '56', '58', '60'], 
    answer: 1, 
    explanation: '7 × 8 = 56.' 
  },
  { 
    id: 303, 
    section: 'Math', 
    difficulty: 'easy', 
    question: 'Какое из чисел является простым?', 
    options: ['15', '21', '23', '27'], 
    answer: 2, 
    explanation: '23 делится только на 1 и себя, это простое число.' 
  },
  { 
    id: 304, 
    section: 'Math', 
    difficulty: 'easy', 
    question: 'Площадь прямоугольника со сторонами 5 и 8?', 
    options: ['13', '26', '40', '45'], 
    answer: 2, 
    explanation: 'Площадь = длина × ширина = 5 × 8 = 40.' 
  },
  { 
    id: 305, 
    section: 'Math', 
    difficulty: 'easy', 
    question: 'Сколько процентов составляет 25 от 100?', 
    options: ['20%', '25%', '30%', '40%'], 
    answer: 1, 
    explanation: '25/100 = 0.25 = 25%.' 
  },
  { 
    id: 306, 
    section: 'Math', 
    difficulty: 'easy', 
    question: 'Если угол равен 45°, то его смежный угол равен:', 
    options: ['45°', '90°', '135°', '180°'], 
    answer: 2, 
    explanation: 'Смежные углы в сумме дают 180°, так что 180° - 45° = 135°.' 
  },
  
  // Medium Math
  { 
    id: 307, 
    section: 'Math', 
    difficulty: 'medium', 
    question: 'Решите систему: x + y = 5; x - y = 1. Найдите x.', 
    options: ['2', '3', '4', '1'], 
    answer: 1, 
    explanation: 'Складываем уравнения: 2x = 6, следовательно x = 3.' 
  },
  { 
    id: 308, 
    section: 'Math', 
    difficulty: 'medium', 
    question: 'Если f(x) = 2x + 3, чему равно f(5)?', 
    options: ['10', '11', '13', '15'], 
    answer: 2, 
    explanation: 'f(5) = 2(5) + 3 = 10 + 3 = 13.' 
  },
  { 
    id: 309, 
    section: 'Math', 
    difficulty: 'medium', 
    question: 'Среднее значение чисел 4, 8, 12, 16 равно:', 
    options: ['8', '10', '12', '14'], 
    answer: 1, 
    explanation: '(4+8+12+16)/4 = 40/4 = 10.' 
  },
  { 
    id: 310, 
    section: 'Math', 
    difficulty: 'medium', 
    question: 'Упростите: (x² - 9)/(x - 3)', 
    options: ['x + 3', 'x - 3', 'x² - 3', '3'], 
    answer: 0, 
    explanation: 'x² - 9 = (x-3)(x+3), поэтому (x-3)(x+3)/(x-3) = x + 3.' 
  },
  { 
    id: 311, 
    section: 'Math', 
    difficulty: 'medium', 
    question: 'В прямоугольном треугольнике с катетами 3 и 4, гипотенуза равна:', 
    options: ['5', '6', '7', '8'], 
    answer: 0, 
    explanation: 'По теореме Пифагора: √(3² + 4²) = √(9 + 16) = √25 = 5.' 
  },
  { 
    id: 312, 
    section: 'Math', 
    difficulty: 'medium', 
    question: 'Площадь круга с радиусом 4 равна (используя π ≈ 3.14):', 
    options: ['12.56', '25.12', '50.24', '100.48'], 
    answer: 2, 
    explanation: 'A = πr² = 3.14 × 4² = 3.14 × 16 = 50.24.' 
  },
  
  // Hard Math
  { 
    id: 313, 
    section: 'Math', 
    difficulty: 'hard', 
    question: 'Квадратная функция f(x) = x² - 6x + 8, её вершина находится в точке:', 
    options: ['(3, -1)', '(3, 1)', '(2, 0)', '(-3, 1)'], 
    answer: 0, 
    explanation: 'Вершина x = -b/2a = 6/2 = 3, f(3) = 9 - 18 + 8 = -1. Ответ: (3, -1).' 
  },
  { 
    id: 314, 
    section: 'Math', 
    difficulty: 'hard', 
    question: 'Найдите корни уравнения x² - 5x + 6 = 0', 
    options: ['1 и 6', '2 и 3', '-2 и -3', '3 и 2'], 
    answer: 1, 
    explanation: 'Факторизация: (x-2)(x-3) = 0, корни x = 2 и x = 3.' 
  },
  { 
    id: 315, 
    section: 'Math', 
    difficulty: 'hard', 
    question: 'Если sin(θ) = 3/5 и θ в первом квадранте, чему равен cos(θ)?', 
    options: ['4/5', '3/4', '5/3', '2/5'], 
    answer: 0, 
    explanation: 'По теореме Пифагора: cos²(θ) = 1 - sin²(θ) = 1 - 9/25 = 16/25, cos(θ) = 4/5.' 
  },
  { 
    id: 316, 
    section: 'Math', 
    difficulty: 'hard', 
    question: 'Логарифм log₂(32) равен:', 
    options: ['4', '5', '6', '7'], 
    answer: 1, 
    explanation: '2⁵ = 32, следовательно log₂(32) = 5.' 
  },
  { 
    id: 317, 
    section: 'Math', 
    difficulty: 'hard', 
    question: 'Количество способов выбрать 2 человека из 5 (комбинация):', 
    options: ['5', '10', '15', '20'], 
    answer: 1, 
    explanation: 'C(5,2) = 5!/(2!×3!) = (5×4)/(2×1) = 10.' 
  },
  { 
    id: 318, 
    section: 'Math', 
    difficulty: 'hard', 
    question: 'Если график функции симметричен относительно оси Y, функция:', 
    options: ['Четная', 'Нечетная', 'Линейная', 'Экспоненциальная'], 
    answer: 0, 
    explanation: 'Четная функция f(-x) = f(x) симметрична относительно оси Y.' 
  },

  // ===== ДОПОЛНИТЕЛЬНЫЕ ВОПРОСЫ ДЛЯ РАСШИРЕНИЯ БАЗЫ =====
  
  // Reading - дополнительные вопросы
  { 
    id: 401, 
    section: 'Reading', 
    difficulty: 'easy', 
    question: 'Какой литературный прием используется: "The wind whispered through the trees"?', 
    options: ['Метафора', 'Олицетворение', 'Сравнение', 'Гипербола'], 
    answer: 1, 
    explanation: 'Олицетворение придает неодушевленным объектам человеческие качества.' 
  },
  { 
    id: 402, 
    section: 'Reading', 
    difficulty: 'medium', 
    question: 'Автор пишет: "The data suggests, although not conclusively..." Это пример:', 
    options: ['Уверенности', 'Осторожности', 'Скептицизма', 'Отрицания'], 
    answer: 1, 
    explanation: 'Фразы как "not conclusively" показывают осторожный подход автора.' 
  },
  { 
    id: 403, 
    section: 'Reading', 
    difficulty: 'hard', 
    question: 'Текст переходит от описания проблемы к предложению решения. Это структура:', 
    options: ['Сравнение-контраст', 'Причина-следствие', 'Проблема-решение', 'Хронологическая'], 
    answer: 2, 
    explanation: 'Структура "проблема-решение" сначала описывает проблему, затем предлагает решение.' 
  },
  { 
    id: 404, 
    section: 'Reading', 
    difficulty: 'easy', 
    question: 'Что такое тезисное утверждение?', 
    options: ['Первое предложение', 'Главный аргумент эссе', 'Заключительная мысль', 'Вопрос к читателю'], 
    answer: 1, 
    explanation: 'Тезисное утверждение выражает главный аргумент или позицию эссе.' 
  },
  { 
    id: 405, 
    section: 'Reading', 
    difficulty: 'medium', 
    question: 'Автор использует статистику 1950-х годов. Это может быть проблемой из-за:', 
    options: ['Точности', 'Актуальности', 'Сложности', 'Объективности'], 
    answer: 1, 
    explanation: 'Старые данные могут быть неактуальными для современного анализа.' 
  },
  
  // Grammar - дополнительные вопросы
  { 
    id: 406, 
    section: 'Grammar', 
    difficulty: 'easy', 
    question: 'Выберите правильное: "The team ___ won the championship."', 
    options: ['has', 'have', 'is', 'are'], 
    answer: 0, 
    explanation: 'Коллективное существительное "team" обычно единственного числа (has).' 
  },
  { 
    id: 407, 
    section: 'Grammar', 
    difficulty: 'medium', 
    question: 'Исправьте: "She don\'t like pizza."', 
    options: ['She doesn\'t likes pizza', 'She doesn\'t like pizza', 'She don\'t likes pizza', 'Правильно как есть'], 
    answer: 1, 
    explanation: '"She" требует "doesn\'t", а не "don\'t".' 
  },
  { 
    id: 408, 
    section: 'Grammar', 
    difficulty: 'hard', 
    question: 'Какое предложение правильное?', 
    options: ['Who did you give it to?', 'To whom did you give it?', 'Оба правильны', 'Ни одно не правильно'], 
    answer: 2, 
    explanation: 'Оба грамматически правильны, но "to whom" более формально.' 
  },
  { 
    id: 409, 
    section: 'Grammar', 
    difficulty: 'medium', 
    question: 'Какое слово лишнее: "The reason why is because of budget."', 
    options: ['reason', 'why', 'because', 'budget'], 
    answer: 2, 
    explanation: '"The reason why" не требует "because" — это избыточно.' 
  },
  { 
    id: 410, 
    section: 'Grammar', 
    difficulty: 'easy', 
    question: 'Выберите правильное: "___ going to the store."', 
    options: ['Their', 'There', 'They\'re', 'Thier'], 
    answer: 2, 
    explanation: '"They\'re" — сокращение от "they are".' 
  },
  
  // Math - дополнительные вопросы
  { 
    id: 411, 
    section: 'Math', 
    difficulty: 'easy', 
    question: 'Какое число является наименьшим общим кратным 4 и 6?', 
    options: ['12', '24', '6', '8'], 
    answer: 0, 
    explanation: 'НОК(4,6) = 12.' 
  },
  { 
    id: 412, 
    section: 'Math', 
    difficulty: 'medium', 
    question: 'Если цена товара увеличилась с $50 до $60, процент увеличения:', 
    options: ['10%', '15%', '20%', '25%'], 
    answer: 2, 
    explanation: 'Увеличение = (60-50)/50 × 100% = 20%.' 
  },
  { 
    id: 413, 
    section: 'Math', 
    difficulty: 'hard', 
    question: 'График y = -x² + 4x - 3 открывается:', 
    options: ['Вверх', 'Вниз', 'Влево', 'Вправо'], 
    answer: 1, 
    explanation: 'Коэффициент при x² отрицательный, парабола открывается вниз.' 
  },
  { 
    id: 414, 
    section: 'Math', 
    difficulty: 'medium', 
    question: 'Медиана чисел 3, 7, 9, 15, 20 равна:', 
    options: ['7', '9', '10', '12'], 
    answer: 1, 
    explanation: 'Медиана — среднее значение в упорядоченном списке: 9.' 
  },
  { 
    id: 415, 
    section: 'Math', 
    difficulty: 'easy', 
    question: 'Сколько градусов в сумме углов треугольника?', 
    options: ['90°', '180°', '270°', '360°'], 
    answer: 1, 
    explanation: 'Сумма углов любого треугольника всегда 180°.' 
  },
  { 
    id: 416, 
    section: 'Math', 
    difficulty: 'hard', 
    question: 'Если вероятность события A равна 0.3, а события B равна 0.4 (независимые), вероятность обоих:', 
    options: ['0.12', '0.7', '0.4', '0.5'], 
    answer: 0, 
    explanation: 'P(A и B) = P(A) × P(B) = 0.3 × 0.4 = 0.12.' 
  },
  { 
    id: 417, 
    section: 'Math', 
    difficulty: 'medium', 
    question: 'Решите неравенство: 3x - 5 > 10', 
    options: ['x > 3', 'x > 5', 'x > 10', 'x > 15'], 
    answer: 1, 
    explanation: '3x > 15, следовательно x > 5.' 
  },
  { 
    id: 418, 
    section: 'Math', 
    difficulty: 'easy', 
    question: 'Объем куба со стороной 3 равен:', 
    options: ['9', '18', '27', '36'], 
    answer: 2, 
    explanation: 'V = a³ = 3³ = 27.' 
  },
  { 
    id: 419, 
    section: 'Math', 
    difficulty: 'hard', 
    question: 'Производная функции f(x) = x³ равна:', 
    options: ['3x²', 'x²', '3x', 'x³/3'], 
    answer: 0, 
    explanation: 'f\'(x) = 3x² (правило степенной функции).' 
  },
  { 
    id: 420, 
    section: 'Math', 
    difficulty: 'medium', 
    question: 'Если 2^x = 16, то x равен:', 
    options: ['2', '3', '4', '5'], 
    answer: 2, 
    explanation: '2⁴ = 16, следовательно x = 4.' 
  },
];

// Функции для работы с localStorage
export const STORAGE_KEYS = {
  QUIZ: 'studysat_quiz_progress',
  BOOKMARKS: 'studysat_bookmarks',
  FLASHCARD_INDEX: 'studysat_flashcard_index',
  SRS: 'studysat_srs',
  PLANNER: 'studysat_planner',
  SETTINGS: 'studysat_settings',
};

export interface QuizProgress {
  attempts: number;
  correct: number;
  history: { qId: number; correct: boolean; timestamp: string }[];
}

export interface SRSCard {
  flashId: string;
  score: number; // 0-5 (Supermemo scale)
  nextReview: string; // ISO date
  interval: number; // days
}
