import { Link } from 'wouter';
import { Tv, ArrowRight } from 'lucide-react';

const ScreenAdvertisingCard = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-700 shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/20">
                    <Tv className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={2} />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Advertise Your Business
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 mb-6">
                    Get your business featured on our in-shop digital screens. Reach customers while they wait!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
                    <div className="text-white">
                      <div className="text-sm font-medium opacity-90">Starting at</div>
                      <div className="text-4xl font-bold">$50<span className="text-xl">/year</span></div>
                    </div>
                    
                    <Link href="/screen-advertising">
                      <button className="group bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2">
                        View Packages
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/20">
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
