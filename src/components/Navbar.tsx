import { useState, useEffect } from 'react'; // Import useEffect
import { Menu, CheckCircle, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useParams } from 'react-router-dom';

interface NavbarProps {
  currentQuestion: number;
  answers: Record<string, string>;
  onQuestionSelect: (questionNumber: number) => void;
}

const Navbar = ({ currentQuestion, answers, onQuestionSelect }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const getQuestionStatus = (questionNumber: number) => {
    const hasAnswer = answers[questionNumber.toString()]?.trim().length > 0;
    const isCurrent = questionNumber === currentQuestion;

    if (isCurrent) return 'current';
    if (hasAnswer) return 'answered';
    return 'unanswered';
  };

  const getStatusIcon = (status: boolean) => {
    switch (status) {
      case true:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case false:
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-red-400" />;
    }
  };

  const truncateQuestion = (question: string, maxLength: number = 50) => {
    return question.length > maxLength ? question.substring(0, maxLength) + '...' : question;
  };

  const routeParams = useParams(); 

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!routeParams.clientIdParam) {
        setIsLoading(false); 
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://ai-app.roverpass.com/questionnaire/qas/?fid=${routeParams.clientIdParam}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const res = await response.json();
        setQuestions(res);
      } catch (err) {
        console.error("Failed to fetch questions for Navbar:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [routeParams.clientIdParam]);

  if (isLoading) {
    return (
      <nav className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-center">
        <p className="text-gray-600">Loading questions...</p>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-center">
        <p className="text-red-500">Error loading questions: {error}</p>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-300"
                >
                  <Menu className="h-4 w-4" />
                  <span>Questions</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[85vh]">
                <DrawerHeader>
                  <DrawerTitle>Question Navigation</DrawerTitle>
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Answered</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Circle className="h-3 w-3 text-gray-400" />
                        <span>Pending</span>
                      </div>
                    </div>
                  </div>
                </DrawerHeader>
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-2 pb-4">
                    {questions.length === 0 ? (
                      <p className="text-gray-500 text-center">No questions available.</p>
                    ) : (
                      questions.map((element) => {
                        const status = getQuestionStatus(element.checked);

                        return (
                          <div
                            key={element.type}
                            onClick={() => {
                              console.log(element.type)
                              onQuestionSelect(parseInt(element.type));
                              setIsOpen(false);
                            }}
                            className={`flex items-start space-x-3 p-3 hover:bg-red-50 cursor-pointer rounded-md transition-colors ${
                              status === 'current' ? 'bg-red-50 border-l-4 border-red-400' : ''
                            }`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              {getStatusIcon(element.checked)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  Q{element.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 leading-tight">
                                {truncateQuestion(element.question)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-900">
              RV Park Questionnaire
            </h1>
            <p className="text-sm text-gray-600">
              Help us create your perfect campground website
            </p>
          </div>

          <div className="flex items-center">
            <img
              src="https://d21q6se01pvc3d.cloudfront.net/assets/logos/roverpass-logo-6ef4a70297c9f89675416cc4ae9e586c822b3ba2f245abc4fa76b6ca1bedc20e.svg"
              alt="Logo"
              className="h-10 w-auto"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;