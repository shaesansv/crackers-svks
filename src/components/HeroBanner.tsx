import React, { useState, useEffect, useRef } from 'react';
import { Fireworks } from '@fireworks-js/react';
import { 
  Sparkles, 
  Flame, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Factory,
  CheckCircle2,
  Percent,
  Star,
  Award
} from 'lucide-react';

// Product images for hero showcase cards (served from Cloudinary CDN)
const shot60 = 'https://res.cloudinary.com/qynsp4om/image/upload/v1787916520/products/60-shot.png';
const flowerPot = 'https://res.cloudinary.com/qynsp4om/image/upload/v1787916503/products/flower-pot-deluxe.png';
const sparkler = 'https://res.cloudinary.com/qynsp4om/image/upload/v1787916497/products/electric_sparklers.png';
const chakkar = 'https://res.cloudinary.com/qynsp4om/image/upload/v1787916500/products/ground-chakkar-deluxe.png';
const shot30 = 'https://res.cloudinary.com/qynsp4om/image/upload/v1787916519/products/30-shot.png';

interface HeroBannerProps {
  onShopClick?: () => void;
  onExploreCategories?: () => void;
  onSafetyClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopClick,
  onExploreCategories,
  onSafetyClick
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showFireworks, setShowFireworks] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = [
    {
      id: 'diwali-mega-sale',
      tag: 'DIRECT SIVAKASI FACTORY WHOLESALE',
      title: 'Diwali Grand Festive Sale',
      highlight: 'FLAT 80% OFF',
      subtitle: 'Celebrate with India\'s most trusted Sivakasi fireworks. Direct factory prices, 100% genuine quality, and safe pan-India transport delivery.',
      primaryBtnText: 'SHOP NOW (80% OFF)',
      primaryBtnAction: onShopClick || (() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })),
      secondaryBtnText: 'EXPLORE CATEGORIES',
      secondaryBtnAction: onExploreCategories || (() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })),
      themeBg: 'from-slate-950 via-red-950/80 to-slate-950',
      accentColor: '#E6A100',
      badges: [
        { icon: <Percent className="w-3.5 h-3.5" />, text: 'Flat 80% Discount' },
        { icon: <Factory className="w-3.5 h-3.5" />, text: 'Direct Factory Rate' },
        { icon: <Truck className="w-3.5 h-3.5" />, text: 'Pan-India Transport' }
      ],
      showcaseItems: [
        { img: shot60, name: '60 Shots Sky Bomb', badge: 'Best Seller' },
        { img: flowerPot, name: 'Deluxe Flower Pots', badge: 'Family Favorite' },
        { img: chakkar, name: 'Ground Chakkars', badge: 'Special' }
      ]
    },
    {
      id: 'sky-shots-special',
      tag: 'NIGHT SKY SPECTACULAR • MULTI-SHOT WONDERS',
      title: 'Dazzling Aerial & Sky Shots',
      highlight: 'MEGA BURSTS',
      subtitle: 'Transform your celebrations with mesmerizing sky colors, glittering floral palms, crackling aerial shells, and 12 to 60 multi-shot combos.',
      primaryBtnText: 'EXPLORE SKY SHOTS',
      primaryBtnAction: onShopClick || (() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })),
      secondaryBtnText: 'VIEW CRACKER LIST',
      secondaryBtnAction: onShopClick || (() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })),
      themeBg: 'from-slate-950 via-indigo-950/90 to-slate-950',
      accentColor: '#38BDF8',
      badges: [
        { icon: <Sparkles className="w-3.5 h-3.5" />, text: '12 to 60 Color Shots' },
        { icon: <Star className="w-3.5 h-3.5" />, text: 'High Altitude Display' },
        { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: '100% Tested Safety' }
      ],
      showcaseItems: [
        { img: shot30, name: '30 Shot Royal Star', badge: 'Grand Sky Shot' },
        { img: shot60, name: '60 Shot Mega Show', badge: 'Night Wonder' }
      ]
    },
    {
      id: 'family-safe-sparklers',
      tag: '100% ECO-FRIENDLY & FAMILY SAFE',
      title: 'Sparkling Moments for Family',
      highlight: 'GREEN CRACKERS',
      subtitle: 'Kid-friendly electric sparklers, dazzling giant flower pots, noiseless novelties, and low-smoke certified crackers for safe celebrations.',
      primaryBtnText: 'SHOP SPARKLERS & POTS',
      primaryBtnAction: onShopClick || (() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })),
      secondaryBtnText: 'SAFETY GUIDELINES',
      secondaryBtnAction: onSafetyClick || (() => document.getElementById('safety')?.scrollIntoView({ behavior: 'smooth' })),
      themeBg: 'from-slate-950 via-emerald-950/80 to-slate-950',
      accentColor: '#10B981',
      badges: [
        { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: 'Low Smoke Formula' },
        { icon: <Sparkles className="w-3.5 h-3.5" />, text: 'Child Friendly' },
        { icon: <Award className="w-3.5 h-3.5" />, text: 'Eco-Certified' }
      ],
      showcaseItems: [
        { img: sparkler, name: 'Electric Sparklers', badge: 'Low Smoke' },
        { img: flowerPot, name: 'Special Flower Pot', badge: 'Vibrant Colors' },
        { img: chakkar, name: 'Spinning Chakkars', badge: 'Kids Favorite' }
      ]
    }
  ];

  // Auto slide effect
  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full bg-slate-950 text-white overflow-hidden select-none">
      
      {/* 1. Dynamic Fireworks Front Layer */}
      {showFireworks && (
        <div className="absolute inset-0 z-25 pointer-events-none opacity-80 sm:opacity-90 transition-opacity duration-700">
          <Fireworks
            options={{
              rocketsPoint: { min: 20, max: 80 },
              hue: { min: 20, max: 360 },
              delay: { min: 50, max: 90 },
              acceleration: 1.015,
              friction: 0.97,
              gravity: 1.15,
              particles: 35,
              traceLength: 2,
              traceSpeed: 4,
              explosion: 3,
              intensity: 3,
              flickering: 25,
              lineStyle: 'round',
              brightness: { min: 70, max: 95 },
              decay: { min: 0.015, max: 0.03 },
              mouse: { click: false, move: false, max: 0 }
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* 2. Top Shimmer Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E6A100] to-transparent z-30 opacity-80 animate-pulse"></div>

      {/* 3. Main Hero Slider Container */}
      <div 
        className="relative z-20 w-full min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex items-center overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides Track */}
        <div 
          className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id}
              className={`w-full flex-shrink-0 relative bg-gradient-to-br ${slide.themeBg} flex items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-8 lg:px-16 overflow-hidden`}
            >
              {/* Subtle ambient light orbs */}
              <div 
                className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: slide.accentColor }}
              ></div>
              <div 
                className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: slide.accentColor }}
              ></div>
              
              {/* Diagonal Luxury Grid Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

              {/* Interactive Content Slide */}
              <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">
                
                {/* Left Column: Text Content & CTAs */}
                <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
                  
                  {/* Eyebrow Tag */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#E6A100]" />
                    <span>{slide.tag}</span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight sm:leading-none mb-3">
                    {slide.title} <br className="hidden sm:inline" />
                    <span 
                      className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF4500] font-black drop-shadow-sm"
                    >
                      {slide.highlight}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-xl mb-6 leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Badges Ribbon */}
                  {slide.badges && (
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-6 sm:mb-8">
                      {slide.badges.map((badge, bIdx) => (
                        <div 
                          key={bIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-200 text-xs font-semibold backdrop-blur-sm hover:border-[#E6A100]/50 transition-colors"
                        >
                          <span className="text-[#E6A100]">{badge.icon}</span>
                          <span>{badge.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Call to Actions */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
                    <button
                      onClick={slide.primaryBtnAction}
                      className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-[#E6A100] to-[#f59e0b] hover:from-[#d48800] hover:to-[#e69500] text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_10px_25px_rgba(230,161,0,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(230,161,0,0.6)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <Flame className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                      <span>{slide.primaryBtnText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={slide.secondaryBtnAction}
                      className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm tracking-wider uppercase backdrop-blur-md transition-all duration-300 hover:border-white/40 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{slide.secondaryBtnText}</span>
                    </button>
                  </div>

                </div>

                {/* Right Column: Visual Product Showcase Carousel Cards */}
                <div className="lg:col-span-5 flex items-center justify-center relative">
                  <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/3] sm:aspect-square flex items-center justify-center">
                    
                    {/* Ambient Glow Pedestal */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#E6A100]/20 to-transparent blur-2xl opacity-60 animate-pulse"></div>
                    
                    {/* Glass Card Container */}
                    <div className="relative w-full h-full bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-between shadow-2xl overflow-hidden group hover:border-[#E6A100]/40 transition-all duration-500">
                      
                      {/* Top Tag inside card */}
                      <div className="w-full flex items-center justify-between z-10">
                        <span className="bg-[#E6A100] text-slate-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                          ⚡ Sivakasi Direct
                        </span>
                        <span className="text-white/80 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Genuine
                        </span>
                      </div>

                      {/* Showcase images layout */}
                      <div className="relative w-full flex-1 flex items-center justify-center my-2">
                        {slide.showcaseItems && slide.showcaseItems.length > 0 && (
                          <div className="relative w-full h-full flex items-center justify-center">
                            {slide.showcaseItems.map((item, itmIdx) => {
                              const isCenter = itmIdx === 0;
                              const isLeft = itmIdx === 1;

                              return (
                                <div
                                  key={itmIdx}
                                  className={`absolute transition-all duration-700 flex flex-col items-center ${
                                    isCenter 
                                      ? 'z-20 scale-100 drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] group-hover:scale-108' 
                                      : isLeft 
                                        ? 'z-10 -translate-x-16 sm:-translate-x-20 scale-75 opacity-80 group-hover:-translate-x-22' 
                                        : 'z-10 translate-x-16 sm:translate-x-20 scale-75 opacity-80 group-hover:translate-x-22'
                                  }`}
                                >
                                  <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center bg-black/30 rounded-2xl border border-white/10 p-2 backdrop-blur-sm">
                                    <img
                                      src={item.img}
                                      alt={item.name}
                                      className="w-full h-full object-contain filter drop-shadow-md"
                                    />
                                  </div>
                                  {isCenter && (
                                    <span className="mt-2 bg-black/80 backdrop-blur-md border border-[#E6A100]/40 text-[#E6A100] text-[10px] sm:text-[11px] font-extrabold px-3 py-0.5 rounded-full whitespace-nowrap shadow-md">
                                      ⭐ {item.name}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Card Bottom Ribbon */}
                      <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold">
                          <span className="text-[#E6A100] font-black text-sm">80%</span> Wholesale Discount
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          Available in Stock
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* 4. Carousel Left / Right Navigation Buttons */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#E6A100] hover:text-slate-950 text-white border border-white/20 hover:border-[#E6A100] flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-xl z-30 cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#E6A100] hover:text-slate-950 text-white border border-white/20 hover:border-[#E6A100] flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-xl z-30 cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* 5. Bottom Slide Progress Dots & Quick Selectors */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-30 bg-black/60 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/15 shadow-xl">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                currentSlide === idx 
                  ? 'w-7 sm:w-9 bg-[#E6A100] shadow-[0_0_10px_#E6A100]' 
                  : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}

          {/* Optional fireworks toggle icon */}
          <button
            type="button"
            onClick={() => setShowFireworks(!showFireworks)}
            title={showFireworks ? "Disable background fireworks" : "Enable background fireworks"}
            className={`ml-2 pl-2 border-l border-white/20 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              showFireworks ? 'text-[#E6A100]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">{showFireworks ? 'FX On' : 'FX Off'}</span>
          </button>
        </div>

      </div>

      {/* 6. TRUST & VALUE PROPOSITION RIBBON (Directly below Hero) */}
      <div className="relative z-30 bg-slate-900 border-t border-b border-white/10 py-3 sm:py-4 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between min-w-[700px] lg:min-w-0 gap-4 text-xs">
          
          <div className="flex items-center gap-2.5 text-gray-200 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#E6A100]/15 border border-[#E6A100]/30 flex items-center justify-center text-[#E6A100]">
              <Factory className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-white uppercase tracking-tight text-[11px] sm:text-xs">Sivakasi Direct</div>
              <div className="text-[10px] text-gray-400">100% Genuine Factory Stock</div>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 shrink-0"></div>

          <div className="flex items-center gap-2.5 text-gray-200 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-white uppercase tracking-tight text-[11px] sm:text-xs">Flat 80% Discount</div>
              <div className="text-[10px] text-gray-400">Lowest Wholesale Rate</div>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 shrink-0"></div>

          <div className="flex items-center gap-2.5 text-gray-200 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-white uppercase tracking-tight text-[11px] sm:text-xs">Pan-India Transport</div>
              <div className="text-[10px] text-gray-400">Safe Hub Delivery</div>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 shrink-0"></div>

          <div className="flex items-center gap-2.5 text-gray-200 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-white uppercase tracking-tight text-[11px] sm:text-xs">Green Crackers</div>
              <div className="text-[10px] text-gray-400">Eco-friendly & Low Smoke</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
