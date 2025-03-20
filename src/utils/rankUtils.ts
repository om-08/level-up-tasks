
export interface Rank {
  name: string;
  requiredPoints: number;
  color: string;
  icon: string;
}

export const RANKS: Rank[] = [
  { name: 'E-Rank Hunter', requiredPoints: 0, color: 'bg-gray-500', icon: 'shield' },
  { name: 'D-Rank Hunter', requiredPoints: 100, color: 'bg-blue-500', icon: 'shield' },
  { name: 'C-Rank Hunter', requiredPoints: 300, color: 'bg-green-500', icon: 'shield' },
  { name: 'B-Rank Hunter', requiredPoints: 600, color: 'bg-yellow-500', icon: 'shield' },
  { name: 'A-Rank Hunter', requiredPoints: 1000, color: 'bg-orange-500', icon: 'shield' },
  { name: 'S-Rank Hunter', requiredPoints: 1500, color: 'bg-red-500', icon: 'shield' },
  { name: 'National Level Hunter', requiredPoints: 2500, color: 'bg-solo-purple', icon: 'trophy' },
  { name: 'Shadow Monarch', requiredPoints: 5000, color: 'bg-solo-purple-dark', icon: 'crown' }
];

export const getCurrentRank = (points: number): Rank => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].requiredPoints) {
      return RANKS[i];
    }
  }
  
  return RANKS[0]; // Default to the lowest rank if something goes wrong
};

export const getNextRank = (points: number): Rank | null => {
  const currentRankIndex = RANKS.findIndex(rank => rank === getCurrentRank(points));
  
  if (currentRankIndex < RANKS.length - 1) {
    return RANKS[currentRankIndex + 1];
  }
  
  return null; // No next rank (max level)
};

export const getProgressToNextRank = (points: number): number => {
  const currentRank = getCurrentRank(points);
  const nextRank = getNextRank(points);
  
  if (!nextRank) return 100; // Max level
  
  const pointsNeeded = nextRank.requiredPoints - currentRank.requiredPoints;
  const pointsGained = points - currentRank.requiredPoints;
  
  return Math.min((pointsGained / pointsNeeded) * 100, 100);
};

export const getRankUpMessage = (rank: Rank): string => {
  return `Congratulations! You've been promoted to ${rank.name}!`;
};

export const checkRankUp = (oldPoints: number, newPoints: number): Rank | null => {
  const oldRank = getCurrentRank(oldPoints);
  const newRank = getCurrentRank(newPoints);
  
  if (newRank.name !== oldRank.name) {
    return newRank;
  }
  
  return null;
};
