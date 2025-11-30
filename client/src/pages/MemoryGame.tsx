import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Trophy, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

type CardType = {
  id: number;
  image: string;
  name: string;
  uniqueId: number;
};

const barberImages = [
  { id: 1, image: '/memory-game/face.png', name: 'Face' },
  { id: 2, image: '/memory-game/razor.png', name: 'Razor' },
  { id: 3, image: '/memory-game/scissors.png', name: 'Scissors' },
  { id: 4, image: '/memory-game/clippers.png', name: 'Clippers' },
  { id: 5, image: '/memory-game/pole.png', name: 'Pole' },
  { id: 6, image: '/memory-game/chair.png', name: 'Chair' },
];

export default function MemoryGame() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [cards, setCards] = useState<CardType[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [emailFailed, setEmailFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const duplicatedCards: CardType[] = [...barberImages, ...barberImages]
      .map((card, index) => ({ ...card, uniqueId: index }))
      .sort(() => Math.random() - 0.5);
    setCards(duplicatedCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameComplete(false);
    setShowForm(false);
    setSubmitted(false);
    setEmailFailed(false);
    setFormData({ name: '', email: '', phone: '' });
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].id)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlipped;

      if (cards[firstIndex].id === cards[secondIndex].id) {
        setMatched([...matched, cards[firstIndex].id]);
        setFlipped([]);

        if (matched.length + 1 === barberIcons.length) {
          setTimeout(() => setGameComplete(true), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const getDealType = () => {
    return moves <= 10 ? 'premium' : 'standard';
  };

  const getDealText = () => {
    return moves <= 10 ? '$5 Off Next Haircut!' : '$2 Off Next Haircut!';
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in your name and email',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest('/api/memory-game/scores', {
        method: 'POST',
        data: {
          playerName: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          moves: moves,
          discountTier: getDealType(),
        },
      });

      queryClient.invalidateQueries({ queryKey: ['/api/memory-game/scores'] });
      setSubmitted(true);
      toast({
        title: 'Deal Email Sent!',
        description: `Check ${formData.email} for your discount code!`,
      });
    } catch (error: any) {
      const errorData = error?.response?.data || error?.data;
      if (errorData?.alreadyPlayed) {
        toast({
          title: 'Already Played This Week',
          description: 'You can only play once per week. Come back next Monday!',
          variant: 'destructive',
        });
      } else if (errorData?.emailFailed) {
        setEmailFailed(true);
      } else {
        toast({
          title: 'Error',
          description: errorData?.message || 'Failed to submit score. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCardFlipped = (index: number) => {
    return flipped.includes(index) || matched.includes(cards[index].id);
  };

  if (emailFailed) {
    return (
      <>
        <MetaTags
          title="Score Saved! | Royals Barber Shop"
          description="Your score was saved. Claim your discount in person!"
        />
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-20">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Score Saved!</h2>
            <p className="text-gray-600 mb-2">
              You earned <span className="font-bold text-amber-600">{getDealText()}</span>
            </p>
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Email Issue:</strong> We couldn't send your discount code by email, but your score was saved!
              </p>
            </div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
              <p className="font-semibold text-amber-900">Your Score: {moves} moves</p>
              <p className="text-sm text-amber-700 mt-2">You're on the leaderboard for this month's FREE HAIRCUT!</p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>How to Redeem:</strong> Tell the barber your name <strong>({formData.name})</strong> and that you played the memory game. They'll check the leaderboard!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-all"
              >
                View Leaderboard
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">You can only play once per week</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <MetaTags
          title="Deal Claimed! | Royals Barber Shop"
          description="You've earned a discount at Royals Barber Shop!"
        />
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-20">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Check Your Email!</h2>
            <p className="text-gray-600 mb-2">
              You earned <span className="font-bold text-amber-600">{getDealText()}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              We sent your discount code to <strong>{formData.email}</strong>
            </p>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
              <p className="font-semibold text-amber-900">Your Score: {moves} moves</p>
              <p className="text-sm text-amber-700 mt-2">Compete for this month's FREE HAIRCUT!</p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>How to Redeem:</strong> Show the email on your phone when you visit the shop. One-time use only!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-all"
              >
                View Leaderboard
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">You can only play once per week</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (showForm) {
    const dealType = getDealType();
    return (
      <>
        <MetaTags
          title="Claim Your Deal | Royals Barber Shop"
          description="Enter your info to claim your discount!"
        />
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-20">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {dealType === 'premium' ? '🎉 Great Score!' : '✂️ Nice Job!'}
              </h2>
              <p className="text-xl font-semibold text-amber-600 mb-2">
                {getDealText()}
              </p>
              <p className="text-gray-600">Completed in {moves} moves</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="(555) 123-4567"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Claim My Deal'}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Your score will be added to the leaderboard!
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (gameComplete) {
    return (
      <>
        <MetaTags
          title="Game Complete! | Royals Barber Shop"
          description="You completed the memory game!"
        />
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-20">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🎊</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Game Complete!</h2>
            <p className="text-2xl text-gray-700 mb-2">Moves: {moves}</p>
            <p className="text-lg text-amber-600 font-semibold mb-8">
              You earned: {getDealText()}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg font-bold text-xl hover:shadow-xl transition-all"
            >
              Claim Your Deal
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <MetaTags
        title="Memory Match Game | Royals Barber Shop"
        description="Play our memory match game and win discounts on your next haircut!"
      />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-20">
        <div className="relative rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full overflow-hidden group">
          {/* Base gradient background - royal blue with black accents */}
          <div className="absolute inset-0 bg-gradient-to-br from-royalblue via-black to-gray-900"></div>
          
          {/* Shimmer overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer pointer-events-none"></div>
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          
          {/* Content wrapper */}
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-lg tracking-tight">Memory Match</h1>
              <p className="text-white/90 mb-6 drop-shadow-md text-lg font-medium">Match pairs of barbershop icons to unlock your discount</p>
              
              {/* Stats container with gradient background */}
              <div className="flex justify-center gap-8 text-center mb-4 bg-gradient-to-r from-black/40 to-black/40 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div>
                  <p className="text-3xl font-bold text-red-500 drop-shadow-md">{moves}</p>
                  <p className="text-sm text-white/80">Moves</p>
                </div>
                <div className="w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                <div>
                  <p className="text-3xl font-bold text-blue-300 drop-shadow-md">{matched.length}/6</p>
                  <p className="text-sm text-white/80">Matched</p>
                </div>
              </div>
              
              {/* Discount tier box - premium styling */}
              <div className="mt-4 p-4 bg-gradient-to-r from-red-600 to-red-700 border-2 border-red-400 rounded-xl shadow-lg relative overflow-hidden group/discount">
                {/* Inner shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/discount:opacity-100 animate-shimmer pointer-events-none"></div>
                <p className="text-sm font-bold text-white drop-shadow-md relative z-10">
                  ≤10 moves = $5 Off | 11+ moves = $2 Off
                </p>
              </div>
            </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6" style={{ perspective: '1200px' }}>
            {cards.map((card, index) => {
              const Icon = card.icon;
              const isFlipped = isCardFlipped(index);

              return (
                <div
                  key={card.uniqueId}
                  onClick={() => handleCardClick(index)}
                  className="aspect-square cursor-pointer group"
                  style={{
                    perspective: '600px',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    className={`memory-card-container w-full h-full transition-all duration-500 ${
                      isFlipped ? 'scale-100' : 'hover:scale-110 hover:-translate-y-1'
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {isFlipped ? (
                      <div className="w-full h-full rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 relative border-2 border-amber-300">
                        {/* Glare effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 pointer-events-none"></div>
                        {/* Inner shadow for depth */}
                        <div className="absolute inset-0 rounded-2xl shadow-inner opacity-40 pointer-events-none"></div>
                        {/* Image container */}
                        <div className="relative z-10 flex items-center justify-center w-full h-full">
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-4/5 h-4/5 object-contain drop-shadow-lg"
                          />
                        </div>
                        {/* Bottom light accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-b-2xl"></div>
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden relative group/card">
                        {/* Base gradient background - royal blue with black */}
                        <div className="absolute inset-0 bg-gradient-to-br from-royalblue via-blue-900 to-black"></div>
                        
                        {/* Animated red gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-600/15 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Card back image */}
                        <img
                          src="/royals-game-logo.jpg"
                          alt="Royals"
                          className="w-full h-full object-cover rounded-2xl group-hover/card:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Top glare effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
                        
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/card:opacity-100 group-hover/card:animate-shimmer pointer-events-none rounded-2xl"></div>
                        
                        {/* Corner accents - on brand red and white */}
                        <div className="absolute top-1 left-1 w-2 h-2 bg-red-600 rounded-full opacity-60 group-hover/card:opacity-100 transition-opacity shadow-lg"></div>
                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-60 group-hover/card:opacity-100 transition-opacity shadow-lg"></div>
                        <div className="absolute bottom-1 left-1 w-2 h-2 bg-white rounded-full opacity-60 group-hover/card:opacity-100 transition-opacity shadow-lg"></div>
                        <div className="absolute bottom-1 right-1 w-2 h-2 bg-red-600 rounded-full opacity-60 group-hover/card:opacity-100 transition-opacity shadow-lg"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

            <div className="text-center">
              <button
                onClick={initializeGame}
                className="text-white/70 hover:text-white underline text-sm transition-colors"
              >
                Reset Game
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
