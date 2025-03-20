
import { useEffect, useState } from 'react';
import { Task } from '@/utils/taskUtils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Trophy, CheckCircle2, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskProgressProps {
  tasks: Task[];
}

interface CategoryData {
  name: string;
  completed: number;
  total: number;
}

const TaskProgress = ({ tasks }: TaskProgressProps) => {
  const [data, setData] = useState<CategoryData[]>([]);
  
  useEffect(() => {
    const categories = new Map<string, { completed: number; total: number }>();
    
    // Initialize all categories
    const categorySet = new Set(tasks.map(task => task.category));
    categorySet.forEach(category => {
      categories.set(category, { completed: 0, total: 0 });
    });
    
    // Count tasks per category
    tasks.forEach(task => {
      const categoryData = categories.get(task.category) || { completed: 0, total: 0 };
      categoryData.total += 1;
      if (task.completed) {
        categoryData.completed += 1;
      }
      categories.set(task.category, categoryData);
    });
    
    // Convert to array for the chart
    const chartData = Array.from(categories.entries()).map(([name, stats]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      completed: stats.completed,
      total: stats.total
    }));
    
    setData(chartData);
  }, [tasks]);
  
  if (tasks.length === 0) return null;
  
  // Color variations for different categories
  const getCategoryColor = (index: number) => {
    const colors = [
      'from-purple-500 to-indigo-600',
      'from-cyan-500 to-blue-600',
      'from-pink-500 to-rose-600',
      'from-amber-500 to-orange-600',
      'from-emerald-500 to-teal-600',
    ];
    
    return colors[index % colors.length];
  };
  
  return (
    <div className="glassmorphism p-6 mb-8 w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">Progress Overview</h3>
      
      <div className="space-y-5 my-4">
        {data.map((category, index) => {
          const percentComplete = category.total > 0 
            ? Math.round((category.completed / category.total) * 100) 
            : 0;
            
          return (
            <div key={category.name} className="animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {category.name === 'Challenge' ? (
                    <Trophy className="h-5 w-5 text-amber-400" />
                  ) : (
                    <CircleDot className={`h-5 w-5 ${index % 2 === 0 ? 'text-purple-400' : 'text-cyan-400'}`} />
                  )}
                  <span className="text-white font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-white font-mono">{category.completed}</span>
                  <span className="text-solo-gray">/</span>
                  <span className="text-solo-gray">{category.total}</span>
                  <span className="ml-2 text-xs bg-black/30 rounded-full px-2 py-0.5 text-white">
                    {percentComplete}%
                  </span>
                </div>
              </div>
              
              <div className="relative h-10 bg-black/20 rounded-lg overflow-hidden">
                {/* Container for task dots */}
                <div className="absolute inset-0 flex items-center px-1.5 py-1.5">
                  {Array.from({ length: category.total }).map((_, i) => {
                    const isCompleted = i < category.completed;
                    
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "flex-1 mx-0.5 h-7 rounded-md transition-all flex items-center justify-center",
                          isCompleted 
                            ? `bg-gradient-to-r ${getCategoryColor(index)} shadow-glow animate-pulse-blue` 
                            : "bg-gray-700/50"
                        )}
                      >
                        {isCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary section */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="glassmorphism p-3 text-center">
            <div className="text-3xl font-bold text-white">
              {tasks.filter(t => t.completed).length}
            </div>
            <div className="text-xs text-solo-gray mt-1">Completed</div>
          </div>
          <div className="glassmorphism p-3 text-center">
            <div className="text-3xl font-bold text-white">
              {tasks.filter(t => !t.completed).length}
            </div>
            <div className="text-xs text-solo-gray mt-1">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskProgress;
