
import { useState } from 'react';
import QuestionnaireForm from '@/components/QuestionnaireForm';
import Navbar from '@/components/Navbar';

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleQuestionSelect = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        currentQuestion={currentQuestion}
        answers={answers}
        onQuestionSelect={handleQuestionSelect}
      />
      <div className="py-8">
        <QuestionnaireForm />
      </div>
    </div>
  );
};

export default Index;
