import { Link } from 'wouter';
import { Tv, ArrowRight, Zap } from 'lucide-react';

const ScreenAdvertisingCard = () => {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-700 shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Limited Spots Badge with Pulse Animation */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
              <div className="relative">
                {/* Pulsing background effect */}
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                {/* Badge */}
                <div className="relative bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg flex items-center gap-1.5">
                  <Zap className="w-3 h-3 md:w-4 md:h-4 fill-white" />
                  <span>Limited Spots</span>
                </div>
              </div>
            </div>
            
            <div className="relative p-4 md:p-12">
              {/* Main content - more compact on mobile */}
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-32 md:h-32 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm border-2 md:border-4 border-white/20">
                    <Tv className="w-8 h-8 md:w-16 md:h-16 text-white" strokeWidth={2} />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl md:text-4xl font-bold text-white mb-2 md:mb-3">
                    Advertise Your Business
                  </h2>
                  <p className="text-sm md:text-xl text-white/90 mb-4 md:mb-6">
                    Get your business featured on our in-shop digital screens. Reach customers while they wait!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-center md:justify-start">
                    <div className="text-white">
                      <div className="text-xs md:text-sm font-medium opacity-90">Starting at</div>
                      <div className="text-2xl md:text-4xl font-bold">$50<span className="text-base md:text-xl">/year</span></div>
                    </div>
                    
                    <Link href="/screen-advertising">
                      <button className="group bg-black hover:bg-gray-900 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2">
                        View Packages
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Package details - hidden on mobile for compactness */}
              <div className="hidden md:block mt-8 pt-8 border-t border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white text-center md:text-left">
                  <div>
                    <div className="font-bold text-lg mb-1">$50/year</div>
                    <div className="text-sm opacity-90">Bring Your Own Image</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">$70/year</div>
                    <div className="text-sm opacity-90">Professional Image Created</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">$100/year</div>
                    <div className="text-sm opacity-90">15-Second Video Created</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScreenAdvertisingCard;
