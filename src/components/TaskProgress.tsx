
import { useEffect, useState } from 'react';
import { Task } from '@/utils/taskUtils';
import { BarChart, Bar, XAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
  
  return (
    <div className="glassmorphism p-6 mb-8 w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">Progress Overview</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#8E9196' }}
              axisLine={{ stroke: '#403E43' }}
              tickLine={{ stroke: '#403E43' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1A1F2C', 
                border: '1px solid rgba(155, 135, 245, 0.2)', 
                borderRadius: '0.5rem' 
              }}
              itemStyle={{ color: '#9b87f5' }}
              labelStyle={{ color: 'white' }}
            />
            <Bar 
              dataKey="total" 
              fill="#403E43" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="completed" 
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#9b87f5" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-solo-purple rounded-sm"></div>
          <span className="text-sm text-solo-gray">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-solo-charcoal rounded-sm"></div>
          <span className="text-sm text-solo-gray">Total</span>
        </div>
      </div>
    </div>
  );
};

export default TaskProgress;
