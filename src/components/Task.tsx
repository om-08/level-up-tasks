
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
  
  const handleToggle = () => {
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
        "task-card cursor-pointer animate-enter mb-4 group",
        task.completed ? "border-solo-purple/30 opacity-70" : ""
      )}
      onClick={handleToggle}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          {task.completed ? (
            <CheckCircle className="h-6 w-6 text-solo-purple transition-all duration-300" />
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
