
import { toast } from "@/components/ui/use-toast";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  createdAt: Date;
  completedAt?: Date;
  points: number;
  isChallenge?: boolean;
  completableAfter?: Date; // New property for time restriction
}

export type TaskCategory = 'daily' | 'weekly' | 'important' | 'personal' | 'work' | 'challenge';

// Reduced points to make progression slower
export const CATEGORIES: { [key in TaskCategory]: { label: string, points: number, minTimeMinutes: number } } = {
  daily: { label: 'Daily', points: 5, minTimeMinutes: 15 },
  weekly: { label: 'Weekly', points: 10, minTimeMinutes: 60 },
  important: { label: 'Important', points: 15, minTimeMinutes: 30 },
  personal: { label: 'Personal', points: 8, minTimeMinutes: 20 },
  work: { label: 'Work', points: 12, minTimeMinutes: 45 },
  challenge: { label: 'Challenge', points: 25, minTimeMinutes: 90 }
};

export const createTask = (title: string, category: TaskCategory, description?: string, isChallenge: boolean = false): Task => {
  const points = CATEGORIES[category].points;
  const minTimeMinutes = CATEGORIES[category].minTimeMinutes;
  
  // Set completable time based on category
  const now = new Date();
  const completableAfter = new Date(now.getTime() + (minTimeMinutes * 60 * 1000));
  
  return {
    id: crypto.randomUUID(),
    title,
    description,
    completed: false,
    category,
    createdAt: new Date(),
    points,
    isChallenge,
    completableAfter
  };
};

export const toggleTaskCompletion = (task: Task, tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>): number => {
  // Check if task is completable based on time restriction
  if (!task.completed && task.completableAfter) {
    const now = new Date();
    if (now < task.completableAfter) {
      const timeRemaining = Math.ceil((task.completableAfter.getTime() - now.getTime()) / (1000 * 60));
      
      toast({
        title: "Task locked",
        description: `This task can be completed in ${timeRemaining} minute${timeRemaining !== 1 ? 's' : ''}.`,
        variant: "destructive"
      });
      
      return 0; // No points awarded, task remains incomplete
    }
  }
  
  const updatedTasks = tasks.map(t => {
    if (t.id === task.id) {
      const completed = !t.completed;
      return {
        ...t,
        completed,
        completedAt: completed ? new Date() : undefined
      };
    }
    return t;
  });
  
  setTasks(updatedTasks);
  
  if (!task.completed) {
    toast({
      title: "Task completed!",
      description: `You earned ${task.points} points`,
    });
    return task.points;
  }
  
  return -task.points; // If uncompleting a task
};

export const addTask = (newTask: Task, tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  setTasks([newTask, ...tasks]);
  
  toast({
    title: "Task added",
    description: "Your new task has been created",
  });
};

export const deleteTask = (taskId: string, tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  setTasks(tasks.filter(task => task.id !== taskId));
  
  toast({
    title: "Task deleted",
    description: "Your task has been removed",
  });
};

export const getCompletedTasks = (tasks: Task[]): Task[] => {
  return tasks.filter(task => task.completed);
};

export const getIncompleteTasks = (tasks: Task[]): Task[] => {
  return tasks.filter(task => !task.completed);
};

export const getChallenges = (tasks: Task[]): Task[] => {
  return tasks.filter(task => task.isChallenge);
};

export const calculateCompletionRate = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  return (getCompletedTasks(tasks).length / tasks.length) * 100;
};

export const PRODUCTIVE_CHALLENGES = [
  {
    title: "Read for 30 minutes",
    description: "Read a book or educational article for at least 30 minutes",
    category: "challenge" as TaskCategory,
    points: 25
  },
  {
    title: "Exercise for 20 minutes",
    description: "Complete a 20-minute workout or physical activity",
    category: "challenge" as TaskCategory,
    points: 30
  },
  {
    title: "Learn a new skill",
    description: "Spend 1 hour learning a new skill or improving an existing one",
    category: "challenge" as TaskCategory,
    points: 40
  },
  {
    title: "Meditate for 10 minutes",
    description: "Practice mindfulness meditation for 10 minutes",
    category: "challenge" as TaskCategory,
    points: 20
  },
  {
    title: "Drink 8 glasses of water",
    description: "Stay hydrated by drinking at least 8 glasses of water today",
    category: "challenge" as TaskCategory,
    points: 15
  },
  {
    title: "Write in a journal",
    description: "Spend 15 minutes writing about your thoughts, goals, or gratitude",
    category: "challenge" as TaskCategory,
    points: 22
  },
  {
    title: "Clean and organize your space",
    description: "Spend 30 minutes decluttering and organizing your environment",
    category: "challenge" as TaskCategory,
    points: 27
  },
  {
    title: "Cook a healthy meal",
    description: "Prepare a nutritious meal from scratch instead of ordering out",
    category: "challenge" as TaskCategory,
    points: 32
  },
  {
    title: "Complete a coding challenge",
    description: "Solve a programming problem or build a small project",
    category: "challenge" as TaskCategory,
    points: 35
  },
  {
    title: "Digital detox for 2 hours",
    description: "Stay away from screens and social media for 2 hours",
    category: "challenge" as TaskCategory,
    points: 38
  }
];

// New function to handle daily task reset
export const resetCompletedTasks = (tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const now = new Date();
  const updatedTasks = tasks.map(task => {
    if (task.completed && task.completedAt) {
      // Check if completed more than 24 hours ago
      const completedTime = new Date(task.completedAt).getTime();
      const timeDiff = now.getTime() - completedTime;
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff >= 24) {
        // Reset task to incomplete without changing points
        return {
          ...task,
          completed: false,
          completedAt: undefined
        };
      }
    }
    return task;
  });
  
  if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
    setTasks(updatedTasks);
    toast({
      title: "Daily Reset",
      description: "Your completed tasks have been reset for a new day.",
    });
  }
};
