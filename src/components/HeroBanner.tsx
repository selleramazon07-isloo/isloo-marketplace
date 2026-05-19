import { TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  const stats = [
    { icon: TrendingUp, label: '12,000+ Listings', desc: 'Active today' },
    { icon: Shield, label: 'Verified Sellers', desc: 'Trusted community' },
    { icon: Zap, label: 'Free to Post', desc: 'No hidden fees' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-brand-900/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 border border-white/10 animate-fade-in">
            <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse-soft" />
            <span className="text-white/80 text-xs font-medium">Islamabad's most trusted marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-3 animate-fade-in-up text-balance">
            Buy & Sell Anything
            <br />
            <span className="text-brand-200">in Islamabad</span>
          </h1>

          <p className="text-white/70 text-sm sm:text-base mb-8 max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            From property to phones, cars to couches -- find it all on Isloo.com, your local marketplace.
          </p>

          <a
            href="#listings"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-brand-50 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Browse Listings
            <ArrowRight size={16} />
          </a>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-12 mt-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {stats.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-2 group">
                <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <Icon size={20} className="text-white" />
                </div>
                <div className="text-center">
                  <span className="text-white text-sm font-bold block">{label}</span>
                  <span className="text-white/50 text-xs">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-50 to-transparent" />
    </section>
  );
}
