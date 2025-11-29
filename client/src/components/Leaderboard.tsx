import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Trophy, Crown, Medal, Gamepad2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { MemoryGameScore } from '@shared/schema';

export default function Leaderboard() {
  const { data: scores, isLoading } = useQuery<MemoryGameScore[]>({
    queryKey: ['/api/memory-game/scores'],
  });

  const getReward = (index: number, score: MemoryGameScore, allScores: MemoryGameScore[]) => {
    if (index === 0) {
      const hasSecondPlace = allScores.length > 1;
      const isTied = hasSecondPlace && allScores[1].moves === score.moves;
      if (isTied) {
        return { text: 'Half Off Haircut', color: 'text-amber-600', bg: 'bg-amber-50' };
      }
      return { text: 'FREE Haircut!', color: 'text-green-600', bg: 'bg-green-50' };
    }
    if (allScores[0] && score.moves === allScores[0].moves) {
      return { text: 'Half Off Haircut', color: 'text-amber-600', bg: 'bg-amber-50' };
    }
    return null;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-amber-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">{index + 1}</span>;
  };

  return (
    <section className="py-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6" />
                  <div>
                    <h2 className="text-lg font-bold">Memory Match Leaderboard</h2>
                    <p className="text-amber-100 text-sm">Win a FREE haircut!</p>
                  </div>
                </div>
                <Link href="/game">
                  <button className="bg-white text-amber-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-amber-50 transition-colors flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    Play Now
                  </button>
                </Link>
              </div>
            </div>

            <div className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : scores && scores.length > 0 ? (
                <div className="space-y-2">
                  {scores.slice(0, 10).map((score, index) => {
                    const reward = getReward(index, score, scores);
                    return (
                      <div
                        key={score.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          index === 0 ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {getRankIcon(index)}
                          <span className="font-medium text-gray-900">{score.playerName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">{score.moves} moves</span>
                          {reward && (
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${reward.bg} ${reward.color}`}>
                              {reward.text}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gamepad2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">No scores yet!</p>
                  <p className="text-sm text-gray-500">Be the first to play and win a FREE haircut!</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
                  <div className="flex gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      10 or fewer moves = $5 off
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      11+ moves = $2 off
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
