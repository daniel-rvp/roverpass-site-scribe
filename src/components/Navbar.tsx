
import { useState } from 'react';
import { Menu, CheckCircle, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const QUESTIONS = {
  "1": "What is the name of your campground?", 
  "2": "Where is your campground located? What is the address?", 
  "3": "What 'are' you? RV Park/Campground/Both?", 
  "4": "What is your campground's phone number and email Address?", 
  "5": "What is the seasonality of your campground (if any)?", 
  "6": "How many sites does your campground have?", 
  "7": "How many employees does your campground have? Tell us about them.", 
  "8": "Provide your written directions on how to reach your campground. If you do not have any, please write them here now.", 
  "9": "Is your campground friendly to all ages and group sizes? If not, what kind of crowd is it aimed towards?", 
  "10": "Is your campground pet friendly?", 
  "11": "Is your campground on/active on any social media sites? If yes, please provide the links.", 
  "12": "If you could quickly sum up why a member of our team would want to stay at your campground while they're in an elevator with you (and they're getting off soon), what would you say?", 
  "13": "Who are the owners? Tell us about them.", 
  "14": "What inspired you/the owners to start your campground business?", 
  "15": "What was the process of starting the campground like?", 
  "16": "Where are you today with your campground?", 
  "17": "Every experience becomes a story to tell in the future. What story do you want your guests to share with friends/family after staying at your campground?", 
  "18": "Tell us about your property in your own words.", 
  "19": "How large is your property? (acres)", 
  "20": "What is around your property? Be as specific as possible.", 
  "21": "What kind of vegetation grows in and around your property?", 
  "22": "What kind of animals live in and around your property?", 
  "23": "What's the weather like in and around your property?", 
  "24": "Anything else you would like to add about your property that would be of interest to a guest who is trying to decide whether to stay at your campground or your nearest competitor?", 
  "25": "What are things guests can do in and around your property? List them off.",
  "26": "For each thing you listed off, tell us about it in detail.",
  "27": "Anything else you would like to add about things to do in and around your property that would be of interest to a guest who is trying to decide whether to stay at your campground or your nearest competitor?",
  "28": "What are the amenities in your campground? List them off.",
  "29": "For each amenity you listed off, tell us about it in detail.",
  "30": "If you haven't already written about it, tell us about the: - Internet at your property - Bathrooms at your property - Water at your property and at your sites - Power at your property and at your sites - Campfires at your property and at your sites (if allowed at all)",
  "31": "Anything else you would like to add about your amenities that would be of interest to a guest who is trying to decide whether to stay at your campground or your nearest competitor?",
  "32": "Tell us about the rates for sites in your campground.",
  "33": "Do you know if your rates are competitive?",
  "34": "Do you, on your current website or elsewhere, have a FAQ that guests can look at?",
  "35": "Do you, on your current website or elsewhere, have a list of your campground rules?",
  "36": "Do you offer any free services?",
  "37": "What do you hear most often from your guests in terms of positive experiences/satisfaction?",
  "38": "Are there any guest complaints you've heard that stick out to you?",
  "39": "Do you have any guest reviews that we can't find through Google or the internet? Can you share those here?",
  "40": "Please provide us with an image of your logo.",
  "41": "We will make the color scheme of your Premium Website match the colors on your current logo. Are you okay with this?",
  "42": "Anything else you would like to add that you feel we have missed in this questionnaire?"
};

interface NavbarProps {
  currentQuestion: number;
  answers: Record<string, string>;
  onQuestionSelect: (questionNumber: number) => void;
}

const Navbar = ({ currentQuestion, answers, onQuestionSelect }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getQuestionStatus = (questionNumber: number) => {
    const hasAnswer = answers[questionNumber.toString()]?.trim().length > 0;
    const isCurrent = questionNumber === currentQuestion;
    
    if (isCurrent) return 'current';
    if (hasAnswer) return 'answered';
    return 'unanswered';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'current':
        return <Clock className="h-4 w-4 text-primary-400" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const truncateQuestion = (question: string, maxLength: number = 50) => {
    return question.length > maxLength ? question.substring(0, maxLength) + '...' : question;
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-primary-50 hover:border-primary-300"
                >
                  <Menu className="h-4 w-4" />
                  <span>Questions</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 sm:w-96">
                <SheetHeader>
                  <SheetTitle>Question Navigation</SheetTitle>
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Answered</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-primary-400" />
                        <span>Current</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Circle className="h-3 w-3 text-gray-400" />
                        <span>Pending</span>
                      </div>
                    </div>
                  </div>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {Object.entries(QUESTIONS).map(([questionNumber, questionText]) => {
                    const qNum = parseInt(questionNumber);
                    const status = getQuestionStatus(qNum);
                    
                    return (
                      <div
                        key={questionNumber}
                        onClick={() => {
                          onQuestionSelect(qNum);
                          setIsOpen(false);
                        }}
                        className={`flex items-start space-x-3 p-3 hover:bg-primary-50 cursor-pointer rounded-md transition-colors ${
                          status === 'current' ? 'bg-primary-50 border-l-4 border-primary-400' : ''
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              Q{questionNumber}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 leading-tight">
                            {truncateQuestion(questionText)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
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
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=40&h=40&fit=crop&crop=center" 
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
