
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  onQuestionClick: (questionNumber: number) => void;
}

export function AppSidebar({ 
  totalQuestions = 42, 
  currentQuestion = 1, 
  answeredQuestions = new Set(), 
  onQuestionClick = () => {} 
}: Partial<AppSidebarProps>) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

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
      "justify-start text-sm font-medium transition-colors",
      {
        'bg-green-600 text-white hover:bg-green-700': status === 'answered',
        'bg-blue-600 text-white hover:bg-blue-700': status === 'current',
        'text-gray-600 hover:bg-gray-100': status === 'unanswered'
      }
    );
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible>
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
                      {!collapsed && <span>Question {questionNumber}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
