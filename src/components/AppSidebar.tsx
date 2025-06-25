
import { Button } from '@/components/ui/button';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  onQuestionClick: (questionNumber: number) => void;
}

const AppSidebar = ({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onQuestionClick
}: AppSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const getQuestionStatus = (questionNumber: number) => {
    if (answeredQuestions.has(questionNumber)) {
      return 'answered';
    }
    if (questionNumber === currentQuestion) {
      return 'current';
    }
    return 'unanswered';
  };

  const getQuestionStyles = (questionNumber: number) => {
    const status = getQuestionStatus(questionNumber);
    return cn(
      "w-full h-10 text-sm font-medium transition-colors justify-start",
      {
        'bg-green-600 text-white hover:bg-green-700': status === 'answered',
        'bg-blue-600 text-white hover:bg-blue-700': status === 'current',
        'bg-gray-200 text-gray-600 hover:bg-gray-300': status === 'unanswered'
      }
    );
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Questions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Array.from({ length: totalQuestions }, (_, index) => {
                const questionNumber = index + 1;
                const status = getQuestionStatus(questionNumber);
                
                return (
                  <SidebarMenuItem key={questionNumber}>
                    <SidebarMenuButton
                      onClick={() => onQuestionClick(questionNumber)}
                      className={getQuestionStyles(questionNumber)}
                      title={`Question ${questionNumber} - ${status}`}
                    >
                      {answeredQuestions.has(questionNumber) ? (
                        <Check size={16} />
                      ) : (
                        <Circle size={16} />
                      )}
                      {!isCollapsed && (
                        <span className="ml-2">Question {questionNumber}</span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {!isCollapsed && (
          <div className="p-4 mt-4 border-t">
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span>Not answered</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
