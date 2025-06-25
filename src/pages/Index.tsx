import QuestionnaireForm from '@/components/QuestionnaireForm';
import AppLayout from '@/components/AppLayout';
import { AppSidebar } from '@/components/AppSidebar';
import { QuestionnaireProvider, useQuestionnaire } from '@/contexts/QuestionnaireContext';

const QuestionnaireWithSidebar = () => {
  const {
    currentQuestion,
    setCurrentQuestion,
    answeredQuestions,
    setAnsweredQuestions,
    answers,
    setAnswers,
  } = useQuestionnaire();

  const handleQuestionClick = (questionNumber: number) => {
    // Save current answer before switching
    const currentAnswer = answers[currentQuestion.toString()] || '';
    if (currentAnswer.trim()) {
      const newAnswers = {
        ...answers,
        [currentQuestion.toString()]: currentAnswer
      };
      setAnswers(newAnswers);
      
      const newAnsweredQuestions = new Set(answeredQuestions);
      newAnsweredQuestions.add(currentQuestion);
      setAnsweredQuestions(newAnsweredQuestions);
    }

    // Switch to clicked question
    setCurrentQuestion(questionNumber);
  };

  return (
    <AppLayout>
      <AppSidebar
        totalQuestions={42}
        currentQuestion={currentQuestion}
        answeredQuestions={answeredQuestions}
        onQuestionClick={handleQuestionClick}
      />
      <div className="bg-gradient-to-br from-blue-50 to-green-50 min-h-full">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">Help us create the perfect website for your RV park</p>
          </div>
          <QuestionnaireForm />
        </div>
      </div>
    </AppLayout>
  );
};

const Index = () => {
  return (
    <QuestionnaireProvider>
      <QuestionnaireWithSidebar />
    </QuestionnaireProvider>
  );
};

export default Index;
