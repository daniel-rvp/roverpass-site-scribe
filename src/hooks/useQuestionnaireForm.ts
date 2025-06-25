import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { QUESTIONS } from '@/constants/questions';

export const useQuestionnaireForm = () => {
  const {
    currentQuestion,
    setCurrentQuestion,
    answeredQuestions,
    setAnsweredQuestions,
    answers,
    setAnswers,
  } = useQuestionnaire();
  
  const [currentAnswer, setCurrentAnswer] = useState(answers[currentQuestion.toString()] || '');
  const totalQuestions = Object.keys(QUESTIONS).length;

  // Update current answer when question changes
  useEffect(() => {
    setCurrentAnswer(answers[currentQuestion.toString()] || '');
  }, [currentQuestion, answers]);

  const saveCurrentAnswer = () => {
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
  };

  const handleNext = () => {
    saveCurrentAnswer();
    if (currentQuestion < totalQuestions) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
    }
  };

  const handlePrevious = () => {
    saveCurrentAnswer();
    if (currentQuestion > 1) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
    }
  };

  const handleSend = async () => {
    try {
      console.log('Sending question for review:', {
        question: currentQuestion,
        answer: currentAnswer
      });
      
      toast({
        title: "Question sent for review",
        description: "Your answer has been submitted for review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send question for review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    const finalAnswers = {
      ...answers,
      [currentQuestion.toString()]: currentAnswer
    };

    try {
      console.log('Submitting all answers:', finalAnswers);
      
      toast({
        title: "Questionnaire submitted!",
        description: "Thank you for completing the questionnaire. We'll be in touch soon!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit questionnaire. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    currentQuestion,
    totalQuestions,
    currentAnswer,
    setCurrentAnswer,
    handleNext,
    handlePrevious,
    handleSend,
    handleSubmit,
  };
};
