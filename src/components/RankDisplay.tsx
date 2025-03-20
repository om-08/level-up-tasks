
import { useState, useEffect } from 'react';
import { getCurrentRank, getNextRank, getProgressToNextRank } from '@/utils/rankUtils';
import { Shield, Trophy, Crown, ArrowUp } from 'lucide-react';

interface RankDisplayProps {
  points: number;
}

const RankDisplay = ({ points }: RankDisplayProps) => {
  const currentRank = getCurrentRank(points);
  const nextRank = getNextRank(points);
  const progress = getProgressToNextRank(points);
  
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [currentRank.name]);
  
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield': return <Shield className="h-6 w-6" />;
      case 'trophy': return <Trophy className="h-6 w-6" />;
      case 'crown': return <Crown className="h-6 w-6" />;
      default: return <Shield className="h-6 w-6" />;
    }
  };
  
  return (
    <div className="glassmorphism p-6 mb-8 w-full max-w-md mx-auto">
      <div className={`flex items-center justify-between ${animate ? 'animate-pulse-blue' : ''} transition-all duration-300`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${currentRank.color} shadow-blue-glow ${animate ? 'animate-levitate' : ''}`}>
            {renderIcon(currentRank.icon)}
          </div>
          <div>
            <p className="text-xs text-solo-gray uppercase tracking-wider font-medium mb-1">Current Rank</p>
            <h3 className="text-xl font-bold text-white">{currentRank.name}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-solo-gray uppercase tracking-wider font-medium mb-1">Your Points</p>
          <p className="text-xl font-bold text-solo-purple">{points}</p>
        </div>
      </div>
      
      {nextRank && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-solo-purple" />
              <p className="text-sm text-solo-gray">Next Rank: <span className="text-white">{nextRank.name}</span></p>
            </div>
            <p className="text-sm text-solo-gray">{nextRank.requiredPoints - points} points needed</p>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
      
      {!nextRank && (
        <div className="mt-6 text-center">
          <p className="text-sm text-solo-purple">You've reached the maximum rank!</p>
        </div>
      )}
    </div>
  );
};

export default RankDisplay;
