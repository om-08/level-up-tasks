
import { useState } from 'react';
import { Task as TaskType, toggleTaskCompletion, CATEGORIES } from '@/utils/taskUtils';
import { CheckCircle, Circle, Trash2, AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskProps {
  task: TaskType;
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  onComplete: (points: number) => void;
  onDelete: (taskId: string) => void;
}

const Task = ({ task, tasks, setTasks, onComplete, onDelete }: TaskProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  
  const handleToggle = () => {
    if (!task.completed) {
      // Only show effects when completing a task, not when uncompleting
      setShowCompletionEffect(true);
      setTimeout(() => setShowCompletionEffect(false), 1000);
    }
    
    const pointsChange = toggleTaskCompletion(task, tasks, setTasks);
    onComplete(pointsChange);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };
  
  const toggleExpand = (e: React.MouseEvent) => {
    if (task.description) {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    }
  };
  
  return (
    <div 
      className={cn(
        "task-card cursor-pointer animate-enter mb-4 group relative overflow-hidden",
        task.completed ? "border-solo-purple/30 opacity-70" : "",
        showCompletionEffect ? "border-solo-purple shadow-blue-glow" : ""
      )}
      onClick={handleToggle}
    >
      {showCompletionEffect && (
        <div className="absolute inset-0 bg-solo-purple/10 animate-pulse-blue z-0"></div>
      )}
      
      {showCompletionEffect && (
        <div className="absolute inset-0 z-10">
          <div className="absolute -inset-2 opacity-20 bg-solo-purple blur-md animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="text-solo-purple font-bold text-xl animate-scale-in">
              +{task.points}
            </div>
          </div>
        </div>
      )}
      
      <div className={cn("flex items-center relative z-20")}>
        <div className="flex-shrink-0 mr-3">
          {task.completed ? (
            <CheckCircle className={cn(
              "h-6 w-6 text-solo-purple transition-all duration-300",
              showCompletionEffect ? "scale-125" : ""
            )} />
          ) : (
            <Circle className="h-6 w-6 text-solo-gray group-hover:text-solo-purple transition-all duration-300" />
          )}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={cn(
                "text-base font-medium transition-all duration-300",
                task.completed ? "text-solo-gray line-through" : "text-white"
              )}>
                {task.title}
              </h3>
              <div className="flex items-center mt-1 gap-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-solo-purple/20 text-solo-purple-light">
                  {CATEGORIES[task.category as keyof typeof CATEGORIES].label}
                </span>
                <span className="text-xs text-solo-gray">
                  {task.points} points
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {task.description && (
                <button 
                  onClick={toggleExpand}
                  className="p-1.5 rounded-full hover:bg-white/5 transition-colors"
                >
                  <AlignLeft className="h-4 w-4 text-solo-gray" />
                </button>
              )}
              <button 
                onClick={handleDelete}
                className="p-1.5 rounded-full hover:bg-white/5 transition-colors"
              >
                <Trash2 className="h-4 w-4 text-solo-gray hover:text-red-400" />
              </button>
            </div>
          </div>
          
          {isExpanded && task.description && (
            <div className="mt-3 text-sm text-solo-gray border-t border-white/5 pt-3 animate-fade-in">
              {task.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;
