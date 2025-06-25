
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface QuestionNavButtonsProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSend: () => void;
  onSubmit: () => void;
}

const QuestionNavButtons = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSend,
  onSubmit,
}: QuestionNavButtonsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3">
        <Button
          onClick={onPrevious}
          disabled={currentQuestion === 1}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
        
        <Button
          onClick={onSend}
          variant="secondary"
          className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700"
        >
          <Send size={16} />
          Send for Review
        </Button>
      </div>

      <div>
        {currentQuestion === totalQuestions ? (
          <Button
            onClick={onSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Submit Questionnaire
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionNavButtons;
