import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Trophy, Crown, Medal, Gamepad2, Calendar, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type LeaderboardScore = {
  id: number;
  rank: number;
  playerName: string;
  email: string;
  phone: string | null;
  moves: number;
  discountTier: string;
  createdAt: string;
};

type WeekInfo = {
  currentWeek: number;
  totalWeeks: number;
  monthName: string;
};

type LeaderboardResponse = {
  scores: LeaderboardScore[];
  weekInfo: WeekInfo | null;
};

export default function Leaderboard() {
  const { data, isLoading } = useQuery<LeaderboardResponse>({
    queryKey: ['/api/memory-game/scores'],
  });

  const scores = data?.scores || [];
  const weekInfo = data?.weekInfo;

  const getReward = (rank: number, score: LeaderboardScore, allScores: LeaderboardScore[]) => {
    if (rank === 1) {
      const hasSecondPlace = allScores.length > 1;
      const isTied = hasSecondPlace && allScores[1].moves === score.moves;
      if (isTied) {
        return { text: 'Half Off Haircut', color: 'text-amber-700', bg: 'bg-gradient-to-r from-amber-100 to-amber-50', border: 'border-amber-300' };
      }
      return { text: 'FREE Haircut!', color: 'text-emerald-700', bg: 'bg-gradient-to-r from-emerald-100 to-emerald-50', border: 'border-emerald-300' };
    }
    if (allScores[0] && score.moves === allScores[0].moves) {
      return { text: 'Half Off Haircut', color: 'text-amber-700', bg: 'bg-gradient-to-r from-amber-100 to-amber-50', border: 'border-amber-300' };
    }
    return null;
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
        <Crown className="w-4 h-4 text-white" />
      </div>
    );
    if (rank === 2) return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-md">
        <Medal className="w-4 h-4 text-white" />
      </div>
    );
    if (rank === 3) return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-md">
        <Medal className="w-4 h-4 text-white" />
      </div>
    );
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
        {rank}
      </div>
    );
  };

  return (
    <section className="py-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20"></div>
              <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Monthly Leaderboard
                        <Sparkles className="w-4 h-4 text-amber-200" />
                      </h2>
                      <p className="text-amber-100 text-sm flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {weekInfo ? (
                          <span className="font-medium">
                            {weekInfo.monthName} - Week {weekInfo.currentWeek} of {weekInfo.totalWeeks}
                          </span>
                        ) : (
                          <span>Win a FREE haircut!</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Link href="/game">
                    <button className="bg-white/95 hover:bg-white text-amber-600 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4" />
                      Play Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Scores List */}
            <div className="p-5">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full bg-gray-700/50 rounded-xl" />
                  ))}
                </div>
              ) : scores && scores.length > 0 ? (
                <div className="space-y-2.5">
                  {scores.slice(0, 10).map((score) => {
                    const rank = score.rank || 1;
                    const reward = getReward(rank, score, scores);
                    return (
                      <div
                        key={score.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 ${
                          rank === 1 
                            ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 shadow-lg shadow-amber-500/10' 
                            : rank === 2
                            ? 'bg-gradient-to-r from-gray-600/30 to-gray-700/20 border border-gray-500/20'
                            : rank === 3
                            ? 'bg-gradient-to-r from-amber-700/20 to-amber-800/10 border border-amber-600/20'
                            : 'bg-gray-800/50 border border-gray-700/30 hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {getRankDisplay(rank)}
                          <div>
                            <span className="font-semibold text-white">{score.playerName}</span>
                            {rank <= 3 && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(score.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className={`font-bold ${rank === 1 ? 'text-amber-400' : 'text-gray-300'}`}>
                              {score.moves}
                            </span>
                            <span className="text-gray-500 text-sm ml-1">moves</span>
                          </div>
                          {reward && (
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${reward.bg} ${reward.color} ${reward.border} shadow-sm`}>
                              {reward.text}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Gamepad2 className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-300 font-medium mb-2">No scores yet this month!</p>
                  <p className="text-sm text-gray-500">Be the first to play and win a FREE haircut!</p>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6 pt-5 border-t border-gray-700/50">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                    <span className="text-emerald-400 font-medium">≤10 moves = $5 off</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm shadow-amber-500/50"></span>
                    <span className="text-amber-400 font-medium">11+ moves = $2 off</span>
                  </div>
                </div>
                <p className="text-center text-gray-500 text-xs mt-4">
                  Play once per week • Monthly winner gets a FREE haircut on the 28th!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
