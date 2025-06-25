
import { createContext, useContext, useState, ReactNode } from 'react';

interface QuestionnaireContextType {
  currentQuestion: number;
  setCurrentQuestion: (question: number) => void;
  answeredQuestions: Set<number>;
  setAnsweredQuestions: (questions: Set<number>) => void;
  answers: Record<string, string>;
  setAnswers: (answers: Record<string, string>) => void;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};

interface QuestionnaireProviderProps {
  children: ReactNode;
}

export const QuestionnaireProvider = ({ children }: QuestionnaireProviderProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <QuestionnaireContext.Provider
      value={{
        currentQuestion,
        setCurrentQuestion,
        answeredQuestions,
        setAnsweredQuestions,
        answers,
        setAnswers,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};
