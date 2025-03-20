
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
}

export type TaskCategory = 'daily' | 'weekly' | 'important' | 'personal' | 'work';

export const CATEGORIES: { [key in TaskCategory]: { label: string, points: number } } = {
  daily: { label: 'Daily', points: 10 },
  weekly: { label: 'Weekly', points: 20 },
  important: { label: 'Important', points: 30 },
  personal: { label: 'Personal', points: 15 },
  work: { label: 'Work', points: 25 }
};

export const createTask = (title: string, category: TaskCategory, description?: string): Task => {
  const points = CATEGORIES[category].points;
  
  return {
    id: crypto.randomUUID(),
    title,
    description,
    completed: false,
    category,
    createdAt: new Date(),
    points
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

export const calculateCompletionRate = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  return (getCompletedTasks(tasks).length / tasks.length) * 100;
};
