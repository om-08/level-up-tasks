
import { useMemo, useState } from 'react';
import Task from './Task';
import { Task as TaskType, getCompletedTasks, getIncompleteTasks } from '@/utils/taskUtils';
import { PlusCircle, ListChecks, SortDesc, SortAsc } from 'lucide-react';

interface TaskListProps {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  onComplete: (points: number) => void;
  onDelete: (taskId: string) => void;
  onAddTaskClick: () => void;
}

type SortOption = 'newest' | 'oldest' | 'points-high' | 'points-low';

const TaskList = ({ tasks, setTasks, onComplete, onDelete, onAddTaskClick }: TaskListProps) => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  const filteredTasks = useMemo(() => {
    const taskList = showCompleted ? getCompletedTasks(tasks) : getIncompleteTasks(tasks);
    
    return [...taskList].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'points-high':
          return b.points - a.points;
        case 'points-low':
          return a.points - b.points;
        default:
          return 0;
      }
    });
  }, [tasks, showCompleted, sortBy]);
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white">
            {showCompleted ? 'Completed Tasks' : 'Active Tasks'}
          </h2>
          <span className="bg-solo-purple/20 text-solo-purple text-sm px-2 py-0.5 rounded-full">
            {filteredTasks.length}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="p-2 rounded-lg bg-solo-dark border border-solo-purple/20 hover:border-solo-purple/50 transition-all"
          >
            <ListChecks className="h-5 w-5 text-solo-gray" />
          </button>
          
          <div className="relative group">
            <button className="p-2 rounded-lg bg-solo-dark border border-solo-purple/20 hover:border-solo-purple/50 transition-all">
              {sortBy.includes('points') ? 
                (sortBy === 'points-high' ? <SortDesc className="h-5 w-5 text-solo-gray" /> : <SortAsc className="h-5 w-5 text-solo-gray" />) : 
                (sortBy === 'newest' ? <SortDesc className="h-5 w-5 text-solo-gray" /> : <SortAsc className="h-5 w-5 text-solo-gray" />)
              }
            </button>
            
            <div className="absolute right-0 mt-2 py-2 w-48 bg-solo-dark border border-solo-purple/20 rounded-lg shadow-lg z-10 hidden group-hover:block animate-fade-in">
              <button 
                onClick={() => setSortBy('newest')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-solo-purple/10 ${sortBy === 'newest' ? 'text-solo-purple' : 'text-white'}`}
              >
                Newest First
              </button>
              <button 
                onClick={() => setSortBy('oldest')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-solo-purple/10 ${sortBy === 'oldest' ? 'text-solo-purple' : 'text-white'}`}
              >
                Oldest First
              </button>
              <button 
                onClick={() => setSortBy('points-high')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-solo-purple/10 ${sortBy === 'points-high' ? 'text-solo-purple' : 'text-white'}`}
              >
                Highest Points
              </button>
              <button 
                onClick={() => setSortBy('points-low')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-solo-purple/10 ${sortBy === 'points-low' ? 'text-solo-purple' : 'text-white'}`}
              >
                Lowest Points
              </button>
            </div>
          </div>
          
          <button
            onClick={onAddTaskClick}
            className="p-2 rounded-lg bg-solo-purple hover:bg-solo-purple-dark transition-all"
          >
            <PlusCircle className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="glassmorphism py-12 px-6 text-center animate-fade-in">
          <p className="text-solo-gray mb-4">
            {showCompleted 
              ? "You haven't completed any tasks yet." 
              : "You don't have any tasks. Add one to get started!"}
          </p>
          {!showCompleted && (
            <button
              onClick={onAddTaskClick}
              className="px-4 py-2 bg-solo-purple rounded-lg text-white hover:bg-solo-purple-dark transition-all"
            >
              Add Your First Task
            </button>
          )}
        </div>
      ) : (
        <div>
          {filteredTasks.map(task => (
            <Task
              key={task.id}
              task={task}
              tasks={tasks}
              setTasks={setTasks}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
