
import { useState } from 'react';
import QuestionnaireForm from '@/components/QuestionnaireForm';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const totalQuestions = 14; // This should match your actual total questions

  const handleQuestionClick = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
    console.log(`Navigating to question ${questionNumber}`);
  };

  const handleQuestionAnswered = (questionNumber: number) => {
    setAnsweredQuestions(prev => new Set([...prev, questionNumber]));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          answeredQuestions={answeredQuestions}
          onQuestionClick={handleQuestionClick}
        />
        <SidebarInset>
          <div className="flex flex-col">
            <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">RoverPass Website Creation</h1>
              </div>
            </header>
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-green-50">
              <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                  <p className="text-lg text-gray-600">Help us create the perfect website for your RV park</p>
                </div>
                <QuestionnaireForm />
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
