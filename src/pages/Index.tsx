
import { useState, useEffect } from 'react';
import RankDisplay from '@/components/RankDisplay';
import TaskList from '@/components/TaskList';
import AddTaskForm from '@/components/AddTaskForm';
import TaskProgress from '@/components/TaskProgress';
import ChallengeList from '@/components/ChallengeList';
import { Task, deleteTask, resetCompletedTasks } from '@/utils/taskUtils';
import { checkRankUp, getRankUpMessage, checkRankDown, getRankDownMessage } from '@/utils/rankUtils';
import { useToast } from '@/components/ui/use-toast';
import { ArrowUp, ChevronUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        // Convert date strings back to Date objects
        return JSON.parse(savedTasks, (key, value) => {
          if (key === 'createdAt' || key === 'completedAt' || key === 'completableAfter') {
            return value ? new Date(value) : undefined;
          }
          return value;
        });
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        return [];
      }
    }
    return [];
  });
  
  const [points, setPoints] = useState<number>(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showRankUpAnimation, setShowRankUpAnimation] = useState(false);
  const [showRankDownAnimation, setShowRankDownAnimation] = useState(false);
  const [rankChangeMessage, setRankChangeMessage] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/login');
    }
  }, [navigate]);
  
  // Save tasks and points to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('points', points.toString());
  }, [points]);
  
  // Implement daily task reset
  useEffect(() => {
    // Check for task reset once on load and then every hour
    const checkTaskReset = () => resetCompletedTasks(tasks, setTasks);
    
    checkTaskReset(); // Check immediately on component mount
    
    const interval = setInterval(checkTaskReset, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(interval);
  }, [tasks, setTasks]);
  
  const handleAddPoints = (pointsToAdd: number) => {
    const oldPoints = points;
    const newPoints = Math.max(0, points + pointsToAdd); // Prevent negative points
    setPoints(newPoints);
    
    // Check for rank up
    const newRankUp = checkRankUp(oldPoints, newPoints);
    if (newRankUp) {
      setRankChangeMessage(getRankUpMessage(newRankUp));
      setShowRankUpAnimation(true);
      setTimeout(() => setShowRankUpAnimation(false), 5000);
      
      toast({
        title: "Rank Up!",
        description: getRankUpMessage(newRankUp),
      });
    }
    
    // Check for rank down
    const newRankDown = checkRankDown(oldPoints, newPoints);
    if (newRankDown) {
      setRankChangeMessage(getRankDownMessage(newRankDown));
      setShowRankDownAnimation(true);
      setTimeout(() => setShowRankDownAnimation(false), 5000);
      
      toast({
        title: "Rank Decreased",
        description: getRankDownMessage(newRankDown),
        variant: "destructive"
      });
    }
  };
  
  const handleTaskDelete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.completed) {
      // If deleting a completed task, subtract its points
      handleAddPoints(-task.points);
    }
    deleteTask(taskId, tasks, setTasks);
  };
  
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-solo-dark text-white pb-20">
      {/* Rank Up Animation */}
      {showRankUpAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="text-center animate-scale-in">
            <div className="text-6xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-4 animate-pulse-blue">Rank Up!</div>
            <div className="flex justify-center animate-levitate">
              <ArrowUp className="h-24 w-24 text-solo-purple animate-pulse-blue" />
            </div>
            <div className="mt-4 text-2xl text-white">{rankChangeMessage}</div>
            <button 
              onClick={() => setShowRankUpAnimation(false)}
              className="mt-8 px-6 py-3 bg-gradient-purple rounded-lg text-white hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Rank Down Animation */}
      {showRankDownAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="text-center animate-scale-in">
            <div className="text-6xl font-bold text-red-500 mb-4 animate-pulse">Rank Decreased</div>
            <div className="flex justify-center animate-levitate">
              <ArrowDown className="h-24 w-24 text-red-500 animate-pulse" />
            </div>
            <div className="mt-4 text-2xl text-white">{rankChangeMessage}</div>
            <button 
              onClick={() => setShowRankDownAnimation(false)}
              className="mt-8 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-lg text-white hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      <header className="py-8 px-4 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-purple bg-clip-text text-transparent">
          Shadow Task Manager
        </h1>
        <p className="text-solo-gray mt-2 max-w-md mx-auto">
          Complete tasks. Earn points. Level up your rank. Arise.
        </p>
      </header>
      
      <div className="container px-4 mx-auto max-w-4xl">
        <RankDisplay points={points} />
        
        <TaskProgress tasks={tasks} />
        
        <ChallengeList tasks={tasks} setTasks={setTasks} />
        
        <TaskList 
          tasks={tasks} 
          setTasks={setTasks} 
          onComplete={handleAddPoints}
          onDelete={handleTaskDelete}
          onAddTaskClick={() => setIsFormOpen(true)}
        />
        
        <AddTaskForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          tasks={tasks}
          setTasks={setTasks}
        />
      </div>
      
      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-solo-purple rounded-full shadow-blue-glow animate-fade-in hover:bg-solo-purple-dark transition-colors"
          aria-label="Back to top"
        >
          <ChevronUp className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default Index;
