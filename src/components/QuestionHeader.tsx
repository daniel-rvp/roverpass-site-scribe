
import { CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
}

const QuestionHeader = ({ currentQuestion, totalQuestions }: QuestionHeaderProps) => {
  return (
    <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
      <CardTitle className="text-xl">
        Question {currentQuestion} of {totalQuestions}
      </CardTitle>
    </CardHeader>
  );
};

export default QuestionHeader;
