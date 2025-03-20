
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
}

export type TaskCategory = 'daily' | 'weekly' | 'important' | 'personal' | 'work' | 'challenge';

export const CATEGORIES: { [key in TaskCategory]: { label: string, points: number } } = {
  daily: { label: 'Daily', points: 10 },
  weekly: { label: 'Weekly', points: 20 },
  important: { label: 'Important', points: 30 },
  personal: { label: 'Personal', points: 15 },
  work: { label: 'Work', points: 25 },
  challenge: { label: 'Challenge', points: 50 }
};

export const createTask = (title: string, category: TaskCategory, description?: string, isChallenge: boolean = false): Task => {
  const points = CATEGORIES[category].points;
  
  return {
    id: crypto.randomUUID(),
    title,
    description,
    completed: false,
    category,
    createdAt: new Date(),
    points,
    isChallenge
  };
};

export const toggleTaskCompletion = (task: Task, tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>): number => {
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
    points: 50
  },
  {
    title: "Exercise for 20 minutes",
    description: "Complete a 20-minute workout or physical activity",
    category: "challenge" as TaskCategory,
    points: 60
  },
  {
    title: "Learn a new skill",
    description: "Spend 1 hour learning a new skill or improving an existing one",
    category: "challenge" as TaskCategory,
    points: 80
  },
  {
    title: "Meditate for 10 minutes",
    description: "Practice mindfulness meditation for 10 minutes",
    category: "challenge" as TaskCategory,
    points: 40
  },
  {
    title: "Drink 8 glasses of water",
    description: "Stay hydrated by drinking at least 8 glasses of water today",
    category: "challenge" as TaskCategory,
    points: 30
  },
  {
    title: "Write in a journal",
    description: "Spend 15 minutes writing about your thoughts, goals, or gratitude",
    category: "challenge" as TaskCategory,
    points: 45
  },
  {
    title: "Clean and organize your space",
    description: "Spend 30 minutes decluttering and organizing your environment",
    category: "challenge" as TaskCategory,
    points: 55
  },
  {
    title: "Cook a healthy meal",
    description: "Prepare a nutritious meal from scratch instead of ordering out",
    category: "challenge" as TaskCategory,
    points: 65
  },
  {
    title: "Complete a coding challenge",
    description: "Solve a programming problem or build a small project",
    category: "challenge" as TaskCategory,
    points: 70
  },
  {
    title: "Digital detox for 2 hours",
    description: "Stay away from screens and social media for 2 hours",
    category: "challenge" as TaskCategory,
    points: 75
  }
];
