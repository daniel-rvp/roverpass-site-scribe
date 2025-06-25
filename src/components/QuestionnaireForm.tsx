
import { Card, CardContent } from '@/components/ui/card';
import { useQuestionnaireForm } from '@/hooks/useQuestionnaireForm';
import QuestionHeader from './QuestionHeader';
import QuestionContent from './QuestionContent';
import QuestionNavButtons from './QuestionNavButtons';

const QuestionnaireForm = () => {
  const {
    currentQuestion,
    totalQuestions,
    currentAnswer,
    setCurrentAnswer,
    handleNext,
    handlePrevious,
    handleSend,
    handleSubmit,
  } = useQuestionnaireForm();

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <QuestionHeader 
          currentQuestion={currentQuestion} 
          totalQuestions={totalQuestions} 
        />
        <CardContent className="p-6">
          <QuestionContent
            currentQuestion={currentQuestion}
            currentAnswer={currentAnswer}
            onAnswerChange={setCurrentAnswer}
          />
          <QuestionNavButtons
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSend={handleSend}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>All information collected will be used to create your custom RV park website</p>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
