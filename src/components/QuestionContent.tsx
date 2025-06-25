
import { Textarea } from '@/components/ui/textarea';
import { QUESTIONS } from '@/constants/questions';

interface QuestionContentProps {
  currentQuestion: number;
  currentAnswer: string;
  onAnswerChange: (value: string) => void;
}

const QuestionContent = ({ currentQuestion, currentAnswer, onAnswerChange }: QuestionContentProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {QUESTIONS[currentQuestion.toString() as keyof typeof QUESTIONS]}
      </h2>
      <Textarea
        value={currentAnswer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Please provide your answer here..."
        className="min-h-[150px] resize-none border-2 border-gray-200 focus:border-blue-500 transition-colors"
      />
    </div>
  );
};

export default QuestionContent;
