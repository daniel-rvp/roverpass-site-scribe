
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

const QuestionnaireForm = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  const totalQuestions = Object.keys(QUESTIONS).length;
  const progress = (currentQuestion / totalQuestions) * 100;

  const handleNext = () => {
    // Save current answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.toString()]: currentAnswer
    }));

    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(answers[(currentQuestion + 1).toString()] || '');
    }
  };

  const handlePrevious = () => {
    // Save current answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.toString()]: currentAnswer
    }));

    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setCurrentAnswer(answers[(currentQuestion - 1).toString()] || '');
    }
  };

  const handleSend = async () => {
    try {
      // This is where the API call would be made to check the question
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
    // Save final answer
    const finalAnswers = {
      ...answers,
      [currentQuestion.toString()]: currentAnswer
    };

    try {
      // This is where the final submission API call would be made
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardTitle className="text-xl">
            Question {currentQuestion}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {QUESTIONS[currentQuestion.toString() as keyof typeof QUESTIONS]}
            </h2>
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Please provide your answer here..."
              className="min-h-[150px] resize-none border-2 border-gray-200 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 1}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              
              <Button
                onClick={handleSend}
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
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  Submit Questionnaire
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>All information collected will be used to create your custom RV park website</p>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
