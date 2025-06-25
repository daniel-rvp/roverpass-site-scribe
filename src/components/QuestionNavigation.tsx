
import { Button } from '@/components/ui/button';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  onQuestionClick: (questionNumber: number) => void;
}

const QuestionNavigation = ({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onQuestionClick
}: QuestionNavigationProps) => {
  const getQuestionStatus = (questionNumber: number) => {
    if (answeredQuestions.has(questionNumber)) {
      return 'answered';
    }
    if (questionNumber === currentQuestion) {
      return 'current';
    }
    return 'unanswered';
  };

  const getQuestionIcon = (questionNumber: number) => {
    const status = getQuestionStatus(questionNumber);
    if (status === 'answered') {
      return <Check size={16} />;
    }
    return <Circle size={16} />;
  };

  const getQuestionStyles = (questionNumber: number) => {
    const status = getQuestionStatus(questionNumber);
    return cn(
      "w-10 h-10 text-sm font-medium transition-colors",
      {
        'bg-green-600 text-white hover:bg-green-700': status === 'answered',
        'bg-blue-600 text-white hover:bg-blue-700': status === 'current',
        'bg-gray-200 text-gray-600 hover:bg-gray-300': status === 'unanswered'
      }
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions</h3>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-14 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const questionNumber = index + 1;
          return (
            <Button
              key={questionNumber}
              onClick={() => onQuestionClick(questionNumber)}
              className={getQuestionStyles(questionNumber)}
              size="sm"
              title={`Question ${questionNumber} - ${getQuestionStatus(questionNumber)}`}
            >
              {answeredQuestions.has(questionNumber) ? (
                <Check size={16} />
              ) : (
                <span>{questionNumber}</span>
              )}
            </Button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span>Not answered</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;
