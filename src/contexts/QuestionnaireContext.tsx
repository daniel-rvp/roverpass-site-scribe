
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface QuestionnaireContextType {
  currentQuestion: number;
  setCurrentQuestion: Dispatch<SetStateAction<number>>;
  answeredQuestions: Set<number>;
  setAnsweredQuestions: Dispatch<SetStateAction<Set<number>>>;
  answers: Record<string, string>;
  setAnswers: Dispatch<SetStateAction<Record<string, string>>>;
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
