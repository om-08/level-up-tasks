
import { useState } from 'react';
import { Task, PRODUCTIVE_CHALLENGES, createTask, addTask, getChallenges } from '@/utils/taskUtils';
import { PlusCircle, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChallengeListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const ChallengeList = ({ tasks, setTasks }: ChallengeListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const existingChallengeIds = new Set(
    getChallenges(tasks).map(challenge => challenge.title)
  );

  const handleAddChallenge = (challenge: typeof PRODUCTIVE_CHALLENGES[0]) => {
    const newTask = createTask(
      challenge.title,
      challenge.category,
      challenge.description,
      true
    );
    
    // Override default points with challenge-specific points
    newTask.points = challenge.points;
    
    addTask(newTask, tasks, setTasks);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div 
        className="glassmorphism p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-solo-purple" />
            <h2 className="text-xl font-bold text-white">Productive Challenges</h2>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-solo-gray" />
          ) : (
            <ChevronDown className="h-5 w-5 text-solo-gray" />
          )}
        </div>
        
        {isOpen && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <p className="text-solo-gray text-sm mb-4">
              Add these pre-defined challenges to earn extra points and boost your productivity.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRODUCTIVE_CHALLENGES.map((challenge, index) => {
                const isAlreadyAdded = existingChallengeIds.has(challenge.title);
                
                return (
                  <div 
                    key={index}
                    className={cn(
                      "task-card p-3 border-solo-purple/20",
                      isAlreadyAdded ? "opacity-50" : "hover:border-solo-purple/50 cursor-pointer"
                    )}
                    onClick={(e) => {
                      if (!isAlreadyAdded) {
                        e.stopPropagation();
                        handleAddChallenge(challenge);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-medium text-white">{challenge.title}</h3>
                        <p className="text-xs text-solo-gray mt-1">{challenge.description}</p>
                        <div className="flex items-center mt-2 gap-2">
                          <span className="px-2 py-0.5 text-xs rounded-full bg-solo-purple/20 text-solo-purple-light">
                            Challenge
                          </span>
                          <span className="text-xs text-solo-gray">
                            {challenge.points} points
                          </span>
                        </div>
                      </div>
                      
                      {!isAlreadyAdded && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddChallenge(challenge);
                          }}
                          className="p-1.5 rounded-full hover:bg-white/5 transition-colors"
                          aria-label="Add challenge"
                        >
                          <PlusCircle className="h-5 w-5 text-solo-purple" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeList;
