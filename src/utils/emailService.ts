
import { supabase } from '@/lib/supabase';
import { Task } from './taskUtils';
import { getCurrentRank } from './rankUtils';

export const sendDailySummaryEmail = async (
  userId: string, 
  email: string,
  tasks: Task[],
  points: number
) => {
  // Count completed tasks
  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks.length / totalTasks) * 100) 
    : 0;
    
  // Get current rank
  const currentRank = getCurrentRank(points);
  
  // Categorize tasks
  const tasksByCategory = tasks.reduce((acc: Record<string, Task[]>, task) => {
    const category = task.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {});
  
  // Create summary data
  const summaryData = {
    userId,
    email,
    date: new Date().toISOString(),
    stats: {
      points,
      rank: currentRank.name,
      completedTasks: completedTasks.length,
      totalTasks,
      completionRate
    },
    categories: Object.entries(tasksByCategory).map(([category, tasks]) => {
      const categoryTasks = tasks as Task[];
      const completed = categoryTasks.filter(t => t.completed).length;
      const total = categoryTasks.length;
      return {
        name: category,
        completed,
        total,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    })
  };
  
  try {
    // Send the summary data to a Supabase Edge Function that will handle the email
    const { error } = await supabase.functions.invoke('send-daily-summary', {
      body: { summary: summaryData }
    });
    
    if (error) {
      console.error('Error sending summary email:', error);
      return false;
    }
    
    console.log('Daily summary email sent successfully');
    return true;
  } catch (err) {
    console.error('Failed to send daily summary email:', err);
    return false;
  }
};
