import React from 'react';

export const SafetyTips: React.FC = () => {
  const dos = [
    "Display fireworks as per the warnings and instructions mentioned on the pack.",
    "Buy fireworks directly from Manufacturer or from authorized dealer only.",
    "Always follow the Safety tips marked on the fireworks.",
    "Use an agarbatti to ignite the fireworks.",
    "Always wear eye protection when lightening fireworks.",
    "Keep a bucket of water or a garden hose handy in case of fire or other mishap."
  ];

  const donts = [
    "Never try to re-light or pick up fireworks that have not ignited fully.",
    "Never shoot fireworks in a metal or glass containers.",
    "Never point or throw fireworks at another person.",
    "Do not wear loose clothing while using fireworks.",
    "Never carry fireworks in your pockets.",
    "After fireworks display never pick up fireworks that may be left over, they may still active."
  ];

  return (
    <div className="flex-grow bg-bg-light pb-20">
      {/* Hero Banner Section */}
      <section 
        className="relative w-full h-[250px] md:h-[320px] overflow-hidden flex items-center justify-center px-10 md:px-20 select-none"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(15, 76, 129, 0.85), rgba(30, 58, 138, 0.95)), url('/parallaxbanner.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Subtle luxury glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-64 bg-secondary-gold/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 border-[40px] border-secondary-gold/10 rounded-full pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 border-[30px] border-secondary-gold/5 rounded-full pointer-events-none"></div>
        
        {/* Center: Premium Text */}
        <div className="relative z-10 flex flex-col items-center text-center gap-2 animate-slide-up">
          <div className="bg-secondary-gold/20 text-secondary-gold font-poppins font-bold text-[10px] md:text-xs px-4 py-1.5 uppercase tracking-[0.3em] rounded-full backdrop-blur-sm border border-secondary-gold/30">
            PROTECT YOUR LOVED ONES
          </div>
          <h1 className="text-4xl md:text-6xl font-poppins font-black text-white tracking-tight drop-shadow-md select-none mt-2">
            Safety <span className="text-secondary-gold">Tips</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-secondary-gold to-transparent mt-4"></div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-16 md:mt-20 relative">
        {/* Intro text */}
        <div className="bg-white rounded-[24px] shadow-[var(--shadow-premium)] p-8 md:p-10 mb-16 text-center border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-gold to-primary-blue"></div>
          <h2 className="text-2xl font-poppins font-bold text-text-primary mb-4">Sarguru Crackers</h2>
          <p className="text-gray-600 font-inter text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
            There are certain Do's & Don'ts to follow while purchasing, bursting and storing crackers. Thus, it is very important to follow the precautions while bursting crackers.
            <br className="hidden md:block" />
            <strong className="text-danger-red mt-2 block">A little negligence, ignorance and carelessness can cause a fatal injury.</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Do's Section */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-3xl font-poppins font-black text-text-primary">Do's</h3>
            </div>
            
            <div className="flex flex-col gap-5">
              {dos.map((item, index) => (
                <div key={`do-${index}`} className="bg-white rounded-[18px] p-5 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow group">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                    <span className="text-green-600 font-bold text-sm font-poppins">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 font-inter text-sm leading-relaxed pt-1.5">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Don'ts Section */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                <svg className="w-6 h-6 text-danger-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
              <h3 className="text-3xl font-poppins font-black text-text-primary">Don'ts</h3>
            </div>
            
            <div className="flex flex-col gap-5">
              {donts.map((item, index) => (
                <div key={`dont-${index}`} className="bg-white rounded-[18px] p-5 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow group">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                    <span className="text-danger-red font-bold text-sm font-poppins">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 font-inter text-sm leading-relaxed pt-1.5">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
