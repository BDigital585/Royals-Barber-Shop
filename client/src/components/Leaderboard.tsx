import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Trophy, Crown, Medal, Gamepad2, Calendar, Gift, Zap } from 'lucide-react';
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
        return { text: 'Half Off Haircut', color: 'text-amber-200', bg: 'bg-gradient-to-r from-amber-600/30 to-amber-700/20', border: 'border-amber-500/50' };
      }
      return { text: 'FREE Haircut!', color: 'text-emerald-300', bg: 'bg-gradient-to-r from-emerald-600/30 to-emerald-700/20', border: 'border-emerald-500/50' };
    }
    if (allScores[0] && score.moves === allScores[0].moves) {
      return { text: 'Half Off Haircut', color: 'text-amber-200', bg: 'bg-gradient-to-r from-amber-600/30 to-amber-700/20', border: 'border-amber-500/50' };
    }
    return null;
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
        <Crown className="w-5 h-5 text-white" />
      </div>
    );
    if (rank === 2) return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-md">
        <Medal className="w-5 h-5 text-white" />
      </div>
    );
    if (rank === 3) return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-md">
        <Medal className="w-5 h-5 text-white" />
      </div>
    );
    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-800/50 to-blue-900/50 flex items-center justify-center font-bold text-blue-200 text-sm border border-blue-700/30">
        {rank}
      </div>
    );
  };

  return (
    <section className="py-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-3xl shadow-2xl overflow-hidden group">
            {/* Base gradient background - royal blue with black accents (matching memory game) */}
            <div className="absolute inset-0 bg-gradient-to-br from-royalblue via-black to-gray-900"></div>
            
            {/* Shimmer overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer pointer-events-none"></div>
            
            {/* Top accent line - red (matching memory game) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>

            {/* Content wrapper */}
            <div className="relative z-10">
              {/* Header */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-700/10"></div>
                <div className="relative bg-gradient-to-r from-red-600 to-red-700 p-5">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                        <Trophy className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                          Memory Match Leaderboard
                        </h2>
                        <p className="text-red-100 text-sm flex items-center gap-2 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {weekInfo ? (
                            <span className="font-medium">
                              {weekInfo.monthName} - Week {weekInfo.currentWeek} of {weekInfo.totalWeeks}
                            </span>
                          ) : (
                            <span>Compete for prizes!</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Link href="/memory-game">
                      <button className="bg-white hover:bg-gray-100 text-red-600 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4" />
                        Play Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Rewards Info Banner */}
              <div className="px-5 pt-5">
                <div className="bg-gradient-to-r from-black/40 to-black/40 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                      <div className="p-2 bg-blue-500/30 rounded-lg">
                        <Zap className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <p className="text-blue-200 font-semibold text-sm">Weekly Discount</p>
                        <p className="text-blue-300/80 text-xs">Play once/week for instant savings</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-600/20 rounded-lg border border-amber-500/30">
                      <div className="p-2 bg-amber-500/30 rounded-lg">
                        <Gift className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <p className="text-amber-200 font-semibold text-sm">Monthly Prize</p>
                        <p className="text-amber-300/80 text-xs">Top scorer wins FREE haircut!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scores List */}
              <div className="p-5">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-14 w-full bg-blue-900/30 rounded-xl" />
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
                              ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 shadow-lg shadow-amber-500/10' 
                              : rank === 2
                              ? 'bg-gradient-to-r from-gray-500/20 to-gray-600/10 border border-gray-400/30'
                              : rank === 3
                              ? 'bg-gradient-to-r from-amber-700/20 to-amber-800/10 border border-amber-600/30'
                              : 'bg-blue-900/30 border border-blue-800/30 hover:bg-blue-800/30'
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
                              <span className={`font-bold ${rank === 1 ? 'text-amber-400' : 'text-white'}`}>
                                {score.moves}
                              </span>
                              <span className="text-gray-400 text-sm ml-1">moves</span>
                            </div>
                            {reward && (
                              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${reward.bg} ${reward.color} ${reward.border}`}>
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
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-blue-700/30">
                      <Gamepad2 className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-white font-medium mb-2">No scores yet this month!</p>
                    <p className="text-sm text-gray-400">Be the first to play and win a FREE haircut!</p>
                  </div>
                )}

                {/* Legend - Weekly Discounts */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className="text-center text-white font-semibold text-sm mb-3">Weekly Discount Tiers</p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/20 rounded-xl border border-emerald-500/30">
                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                      <span className="text-emerald-300 font-semibold">≤10 moves = $5 off</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-600/20 rounded-xl border border-amber-500/30">
                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm shadow-amber-500/50"></span>
                      <span className="text-amber-300 font-semibold">11+ moves = $2 off</span>
                    </div>
                  </div>
                  <p className="text-center text-gray-400 text-xs mt-4">
                    Play once per week to earn your discount via email
                  </p>
                  <p className="text-center text-amber-400 text-xs mt-2 font-medium">
                    Monthly winner announced on the 28th - FREE haircut prize!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
