import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, BookOpen, Brain, FileText, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useUserQuestions, useCreateUserQuestion, useUpdateUserQuestion, useDeleteUserQuestion } from '@/hooks/useQuestions';
import { useAdminQuestions, useCreateAdminQuestion, useUpdateAdminQuestion, useDeleteAdminQuestion } from '@/hooks/useAdminQuestions';
import { useAuth } from '@/contexts/AuthContext';
import type { Question } from '@/data/database';
import { toast } from 'sonner';

const Questions = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Admin: управляет глобальными вопросами; User: только свои
  const { data: adminQuestions = [], isLoading: adminLoading } = useAdminQuestions();
  const { data: userQuestions = [], isLoading: userLoading } = useUserQuestions();
  const createAdminMutation = useCreateAdminQuestion();
  const updateAdminMutation = useUpdateAdminQuestion();
  const deleteAdminMutation = useDeleteAdminQuestion();

  const createMutation = useCreateUserQuestion();
  const updateMutation = useUpdateUserQuestion();
  const deleteMutation = useDeleteUserQuestion();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<Omit<Question, 'id'>>({
    section: 'Reading',
    difficulty: 'easy',
    question: '',
    options: ['', '', '', ''],
    answer: 0,
    explanation: '',
  });

  const resetForm = () => {
    setFormData({
      section: 'Reading',
      difficulty: 'easy',
      question: '',
      options: ['', '', '', ''],
      answer: 0,
      explanation: '',
    });
    setEditingQuestion(null);
  };

  const handleOpenDialog = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        section: question.section,
        difficulty: question.difficulty,
        question: question.question,
        options: [...question.options],
        answer: question.answer,
        explanation: question.explanation,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.question.trim()) {
      toast.error('Введите текст вопроса');
      return;
    }

    if (formData.options.some(opt => !opt.trim())) {
      toast.error('Заполните все варианты ответов');
      return;
    }

    if (formData.explanation.trim() === '') {
      toast.error('Добавьте объяснение');
      return;
    }

    try {
      if (isAdmin) {
        if (editingQuestion) {
          await updateAdminMutation.mutateAsync({
            questionId: editingQuestion.id < 0 ? -editingQuestion.id : editingQuestion.id,
            question: formData,
          });
          toast.success('Вопрос обновлен (админ)');
        } else {
          await createAdminMutation.mutateAsync(formData);
          toast.success('Вопрос создан (админ)');
        }
      } else {
        if (editingQuestion) {
          const questionId = editingQuestion.id < 0 ? -editingQuestion.id : editingQuestion.id;
          await updateMutation.mutateAsync({
            questionId,
            question: formData,
          });
          toast.success('Вопрос обновлен');
        } else {
          await createMutation.mutateAsync(formData);
          toast.success('Вопрос создан');
        }
      }
      handleCloseDialog();
    } catch (error) {
      toast.error('Ошибка при сохранении вопроса');
      console.error(error);
    }
  };

  const handleDelete = async (question: Question) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот вопрос?')) {
      return;
    }

    try {
      const questionId = question.id < 0 ? -question.id : question.id;

      if (isAdmin) {
        await deleteAdminMutation.mutateAsync(questionId);
        toast.success('Вопрос удален (админ)');
      } else {
        await deleteMutation.mutateAsync(questionId);
        toast.success('Вопрос удален');
      }
    } catch (error) {
      toast.error('Ошибка при удалении вопроса');
      console.error(error);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const getSectionIcon = (section: Question['section']) => {
    switch (section) {
      case 'Reading':
        return <BookOpen className="h-4 w-4" />;
      case 'Math':
        return <Brain className="h-4 w-4" />;
      case 'Grammar':
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success/10 text-success border-success/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'hard':
        return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const isLoading = isAdmin ? adminLoading : userLoading;
  const questions = isAdmin ? adminQuestions : userQuestions;

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Пожалуйста, войдите в систему для управления вопросами.
              <Button
                variant="link"
                className="p-0 h-auto ml-2"
                onClick={() => navigate('/auth/login')}
              >
                Войти
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {isAdmin ? 'Админ: вопросы SAT' : 'Мои вопросы'}
            </h1>
            {isAdmin && <ShieldCheck className="h-5 w-5 text-primary" />}
          </div>
          <p className="text-muted-foreground mt-1">
            {isAdmin
              ? 'Добавляйте и редактируйте вопросы по критериям SAT. Пользователи увидят их в практике.'
              : 'Вы можете просматривать вопросы. Добавление/редактирование доступно только админам.'}
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Создать вопрос
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingQuestion ? 'Редактировать вопрос (SAT)' : 'Создать новый вопрос (SAT)'}
                </DialogTitle>
                <DialogDescription>
                  Заполните вопрос по критериям SAT: четкий вопрос, 4 варианта, один правильный, пояснение.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="section">Секция</Label>
                    <Select
                      value={formData.section}
                      onValueChange={(value) => setFormData({ ...formData, section: value as Question['section'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Reading">Reading</SelectItem>
                        <SelectItem value="Math">Math</SelectItem>
                        <SelectItem value="Grammar">Grammar</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Reading — понимание текста; Math — расчёты/алгебра; Grammar — правка текста.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Сложность</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value as Question['difficulty'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Легкая</SelectItem>
                        <SelectItem value="medium">Средняя</SelectItem>
                        <SelectItem value="hard">Сложная</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Ориентируйтесь на время и глубину: easy — базовое, hard — многошаговое/детальный анализ.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Критерии SAT</Label>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Один чёткий правильный ответ</p>
                      <p>• 4 правдоподобных варианта</p>
                      <p>• Объяснение: почему верно и почему другие нет</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Вопрос</Label>
                  <Textarea
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Введите текст вопроса. Для Reading добавьте краткий контекст (1–2 предложения). Для Math укажите формулы."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Варианты ответов (4 варианта, один верный)</Label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Вариант ${index + 1}`}
                        className={formData.answer === index ? 'border-primary' : ''}
                      />
                      <Button
                        type="button"
                        variant={formData.answer === index ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData({ ...formData, answer: index })}
                      >
                        Правильный
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">Объяснение</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Кратко: почему этот ответ верный, почему остальные нет. Для Math — шаги решения; для Reading — цитата/контекст."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createAdminMutation.isPending ||
                      updateAdminMutation.isPending ||
                      createMutation.isPending ||
                      updateMutation.isPending
                    }
                  >
                    {(createAdminMutation.isPending || updateAdminMutation.isPending || createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      editingQuestion ? 'Сохранить изменения' : 'Создать вопрос'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : questions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-2">Пока нет вопросов</p>
            {isAdmin ? (
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Создать первый вопрос
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">Добавление доступно только админам</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {questions.map((question) => (
            <Card key={question.id} className="transition-all hover:shadow-lg hover:-translate-y-0.5">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getSectionIcon(question.section)}
                    <CardTitle className="text-lg">{question.section}</CardTitle>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty === 'easy' ? 'Легкая' : question.difficulty === 'medium' ? 'Средняя' : 'Сложная'}
                  </span>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {question.question}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="text-sm font-medium">Варианты ответов:</div>
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded-md ${
                        index === question.answer
                          ? 'bg-success/10 text-success border border-success/20'
                          : 'bg-muted'
                      }`}
                    >
                      {index + 1}. {option}
                    </div>
                  ))}
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(question)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Редактировать
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(question)}
                      disabled={deleteAdminMutation.isPending || deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;

