
import { useState } from 'react';
import { createTask, TaskCategory, CATEGORIES, addTask, Task } from '@/utils/taskUtils';
import { X } from 'lucide-react';

interface AddTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const AddTaskForm = ({ isOpen, onClose, tasks, setTasks }: AddTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('daily');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const newTask = createTask(title, category, description);
    addTask(newTask, tasks, setTasks);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('daily');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 animate-fade-in">
      <div className="w-full max-w-md bg-solo-dark border border-solo-purple/20 rounded-lg shadow-blue-glow">
        <div className="flex justify-between items-center p-4 border-b border-solo-purple/20">
          <h2 className="text-xl font-bold text-white">Add New Task</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/5">
            <X className="h-5 w-5 text-solo-gray" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-solo-gray mb-1">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-solo-purple/20 rounded-md focus:outline-none focus:ring-1 focus:ring-solo-purple text-white"
              placeholder="What needs to be done?"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-solo-gray mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-solo-purple/20 rounded-md focus:outline-none focus:ring-1 focus:ring-solo-purple text-white h-24 resize-none"
              placeholder="Add details about your task..."
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-solo-gray mb-1">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CATEGORIES).map(([key, { label, points }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key as TaskCategory)}
                  className={`px-3 py-2 text-sm rounded-md transition-all ${
                    category === key 
                      ? 'bg-solo-purple text-white' 
                      : 'bg-black/30 border border-solo-purple/20 text-solo-gray hover:border-solo-purple/50'
                  }`}
                >
                  <span className="block">{label}</span>
                  <span className="text-xs opacity-80">{points} points</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 border border-solo-purple/20 rounded-md text-solo-gray hover:border-solo-purple/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-purple rounded-md text-white hover:opacity-90 transition-opacity shadow-blue-glow"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
