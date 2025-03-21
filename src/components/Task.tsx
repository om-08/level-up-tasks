
import { useState, useRef, useEffect } from 'react';
import { Task as TaskType, toggleTaskCompletion, CATEGORIES } from '@/utils/taskUtils';
import { CheckCircle, Circle, Trash2, AlignLeft, Award, Star, Lock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

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
  const [isLocked, setIsLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const taskRef = useRef<HTMLDivElement>(null);
  
  // Check if task is locked due to time restriction
  useEffect(() => {
    const checkLockStatus = () => {
      if (task.completableAfter && !task.completed) {
        const now = new Date();
        const isCurrentlyLocked = now < task.completableAfter;
        setIsLocked(isCurrentlyLocked);
        
        if (isCurrentlyLocked) {
          setTimeRemaining(formatDistanceToNow(task.completableAfter, { addSuffix: true }));
        }
      } else {
        setIsLocked(false);
      }
    };
    
    checkLockStatus();
    const interval = setInterval(checkLockStatus, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [task]);
  
  // Function to create particles
  const createParticles = () => {
    if (!taskRef.current) return;
    
    const taskElement = taskRef.current;
    const rect = taskElement.getBoundingClientRect();
    
    // Create multiple particles
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      
      // Random position within the task card
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      
      // Randomize the particle appearance
      const size = Math.random() * 8 + 4; // 4-12px
      const color = i % 3 === 0 ? '#ffcc00' : i % 2 === 0 ? '#9b87f5' : '#ffffff';
      
      // Set particle styles
      particle.className = 'completion-particles';
      particle.style.position = 'absolute';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      
      // Set the direction the particle will move (x and y variables for the CSS animation)
      const animX = (Math.random() - 0.5) * 80;
      const animY = (Math.random() - 0.8) * 80; // more upward than downward
      particle.style.setProperty('--x', `${animX}px`);
      particle.style.setProperty('--y', `${animY}px`);
      
      // Add to DOM and remove after animation
      taskElement.appendChild(particle);
      setTimeout(() => {
        if (taskElement.contains(particle)) {
          taskElement.removeChild(particle);
        }
      }, 800);
    }
  };
  
  // Function to create a burst effect
  const createBurst = () => {
    if (!taskRef.current) return;
    
    const burst = document.createElement('div');
    burst.className = 'absolute inset-0 animate-burst';
    taskRef.current.appendChild(burst);
    
    setTimeout(() => {
      if (taskRef.current && taskRef.current.contains(burst)) {
        taskRef.current.removeChild(burst);
      }
    }, 700);
  };
  
  // Create star effect
  const createStars = () => {
    if (!taskRef.current) return;
    
    const taskElement = taskRef.current;
    const rect = taskElement.getBoundingClientRect();
    
    // Add stars
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('div');
      
      // Position stars around the checkmark
      const angle = (Math.PI * 2 / 5) * i;
      const distance = 30 + Math.random() * 20;
      const x = rect.width / 3 + Math.cos(angle) * distance;
      const y = rect.height / 2 + Math.sin(angle) * distance;
      
      // Star styling
      star.className = 'absolute animate-star';
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.opacity = '0';
      star.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${
        i % 2 === 0 ? '#ffcc00' : '#9b87f5'
      }" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      
      // Add star with delay for sequence effect
      setTimeout(() => {
        taskElement.appendChild(star);
        // Animate in
        setTimeout(() => {
          star.style.opacity = '1';
          star.style.transform = 'scale(1.2)';
        }, 50);
        
        // Remove after animation
        setTimeout(() => {
          if (taskElement.contains(star)) {
            taskElement.removeChild(star);
          }
        }, 1000);
      }, i * 100);
    }
  };
  
  const handleToggle = () => {
    if (isLocked) {
      return; // Prevent completion if locked
    }
    
    if (!task.completed) {
      // Only show effects when completing a task, not when uncompleting
      setShowCompletionEffect(true);
      
      // Trigger various completion animations
      createParticles();
      createBurst();
      createStars();
      
      setTimeout(() => setShowCompletionEffect(false), 1500);
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
      ref={taskRef}
      className={cn(
        "task-card cursor-pointer animate-enter mb-4 group relative overflow-hidden",
        task.completed ? "border-solo-purple/30 opacity-80" : "",
        showCompletionEffect ? "border-solo-purple shadow-blue-glow" : "",
        task.isChallenge ? "border-l-4 border-l-solo-purple" : "",
        isLocked ? "border-amber-500/50" : ""
      )}
      onClick={handleToggle}
    >
      {isLocked && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-amber-400 text-xs bg-black/30 px-2 py-1 rounded-full">
          <Lock className="h-3 w-3" />
          <span>Unlocks {timeRemaining}</span>
        </div>
      )}
      
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
        <div className="flex-shrink-0 mr-3 relative">
          {task.completed ? (
            <CheckCircle className={cn(
              "h-6 w-6 text-solo-purple transition-all duration-300",
              showCompletionEffect ? "scale-125 animate-success-pulse" : ""
            )} />
          ) : isLocked ? (
            <Clock className="h-6 w-6 text-amber-400 transition-all duration-300" />
          ) : (
            <Circle className="h-6 w-6 text-solo-gray group-hover:text-solo-purple transition-all duration-300" />
          )}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "text-base font-medium transition-all duration-300",
                  task.completed ? "text-solo-gray line-through" : "text-white"
                )}>
                  {task.title}
                </h3>
                {task.isChallenge && (
                  <Award className="h-4 w-4 text-solo-purple" />
                )}
              </div>
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
