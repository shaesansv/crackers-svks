import React from 'react';

export const About: React.FC = () => {
  // Gallery images (alternating our generated images for variety)
  const galleryImages = [
    { src: '/shop_shelf_1.png', alt: 'Cracker Shop Stock' },
    { src: '/gift_box_1.png', alt: 'Premium Gift Boxes' },
    { src: '/shop_shelf_1.png', alt: 'Crackers Warehouse' },
    { src: '/gift_box_1.png', alt: 'Diwali Gift Hamper' },
    { src: '/gift_box_1.png', alt: 'Sivakasi Crackers Display' },
    { src: '/shop_shelf_1.png', alt: 'Traditional Firework Boxes' },
    { src: '/shop_shelf_1.png', alt: 'Storefront Crackers Stack' },
    { src: '/gift_box_1.png', alt: 'Fancy Cracker Assortment' },
  ];

  return (
    <div className="flex-grow bg-white pb-16">
      {/* 1. Styled Hero Banner */}
      <section className="relative w-full h-[280px] bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 overflow-hidden flex items-center justify-between px-10 md:px-20 select-none border-b-4 border-orange-600">
        {/* Floating background star decorations */}
        <span className="absolute text-blue-900 text-3xl opacity-60 left-12 top-6 rotate-12">★</span>
        <span className="absolute text-blue-900 text-xl opacity-60 left-28 bottom-8 -rotate-12">★</span>
        <span className="absolute text-yellow-100 text-2xl opacity-80 left-8 bottom-1/2">★</span>
        <span className="absolute text-orange-600 text-lg opacity-80 right-1/4 top-10">★</span>
        <span className="absolute text-blue-900 text-2xl opacity-60 right-1/3 bottom-6">★</span>
        
        {/* Left Side: Biggest Sale Text */}
        <div className="relative z-10 flex flex-col items-start gap-1">
          <div className="bg-blue-900 text-white font-extrabold text-[10px] md:text-xs px-3 py-1 uppercase tracking-widest rounded shadow-md transform -rotate-2">
            LIMITED TIME ONLY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-red-600 tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] select-none m-0 p-0 leading-none">
            BIGGEST
          </h1>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] select-none m-0 p-0 leading-none">
            SALE
          </h1>
          <div className="text-yellow-100 font-bold text-lg md:text-2xl mt-1 tracking-wide italic transform rotate-2">
            Exciting offers
          </div>
        </div>

        {/* Center: Glowing Wheel/Chakkar SVG */}
        <div className="hidden md:flex justify-center items-center">
          <svg viewBox="0 0 100 100" width="160" height="160" className="animate-spin-slow drop-shadow-lg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#004d40" strokeWidth="2.5" strokeDasharray="3,2" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" strokeWidth="4" />
            {/* Outer rings */}
            <circle cx="50" cy="50" r="30" fill="none" stroke="#ffd54f" strokeWidth="6" strokeDasharray="12,4" />
            <circle cx="50" cy="50" r="22" fill="#00796b" />
            {/* Center Star */}
            <polygon points="50,30 55,42 68,42 58,50 62,62 50,54 38,62 42,50 32,42 45,42" fill="#ffd700" stroke="#d50000" strokeWidth="1" />
            <circle cx="50" cy="50" r="4" fill="#ffffff" />
          </svg>
        </div>

        {/* Right Side: Rotated About Us Banner */}
        <div className="relative z-10">
          <div className="bg-red-600 px-6 py-3.5 md:px-10 md:py-5 border-4 border-white shadow-2xl transform -rotate-6 rounded-md">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight m-0 select-none uppercase italic">
              ABOUT US
            </h2>
          </div>
        </div>
      </section>

      {/* 2. Main About Section flanked by SVGs */}
      <section className="max-w-5xl mx-auto px-4 mt-16 relative">
        {/* Floating floating contact buttons if standard, otherwise standard graphics */}
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 hidden lg:block select-none pointer-events-none">
          {/* Chinese Firecracker SVG Illustration */}
          <svg width="150" height="250" viewBox="0 0 150 250">
            {/* Main string */}
            <line x1="75" y1="20" x2="75" y2="230" stroke="#ffd700" strokeWidth="3" />
            {/* Individual firecrackers in a stack */}
            {[40, 70, 100, 130, 160, 190].map((y, idx) => (
              <g key={idx}>
                {/* Left side cracker */}
                <line x1="75" y1={y} x2="35" y2={y - 10} stroke="#ffd700" strokeWidth="2" />
                <rect x="15" y={y - 20} width="40" height="14" rx="2" fill="#d50000" transform={`rotate(-15, 35, ${y - 10})`} />
                <rect x="50" y={y - 20} width="6" height="14" fill="#ffd700" transform={`rotate(-15, 35, ${y - 10})`} />
                {/* Right side cracker */}
                <line x1="75" y1={y + 15} x2="115" y2={y + 5} stroke="#ffd700" strokeWidth="2" />
                <rect x="95" y={y - 5} width="40" height="14" rx="2" fill="#d50000" transform={`rotate(15, 115, ${y + 5})`} />
                <rect x="95" y={y - 5} width="6" height="14" fill="#ffd700" transform={`rotate(15, 115, ${y + 5})`} />
              </g>
            ))}
            {/* Hanging knot decoration */}
            <circle cx="75" cy="20" r="10" fill="#ffd700" />
            <polygon points="75,25 70,15 80,15" fill="#d50000" />
          </svg>
        </div>

        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 hidden lg:block select-none pointer-events-none">
          {/* Fountains and Rockets shooting sparks SVG Illustration */}
          <svg width="150" height="250" viewBox="0 0 150 250">
            {/* Cylinder 1 */}
            <rect x="25" y="130" width="35" height="100" rx="3" fill="#673ab7" stroke="#311b92" strokeWidth="1" />
            <circle cx="42.5" cy="150" r="8" fill="#ffd54f" />
            <line x1="42.5" y1="130" x2="42.5" y2="120" stroke="#757575" strokeWidth="2" />
            {/* Spark streams */}
            <path d="M42.5 120 C30 90 20 80 10 90" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeDasharray="3,1" />
            <path d="M42.5 120 C40 80 50 60 65 70" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeDasharray="3,1" />
            
            {/* Cylinder 2 */}
            <rect x="75" y="110" width="40" height="120" rx="3" fill="#ff5722" stroke="#bf360c" strokeWidth="1" />
            <polygon points="95,110 80,125 110,125" fill="#ffd54f" />
            <line x1="95" y1="110" x2="95" y2="95" stroke="#757575" strokeWidth="2" />
            {/* Spark streams */}
            <path d="M95 95 Q115 60 135 80" fill="none" stroke="#ffb74d" strokeWidth="2" />
            <path d="M95 95 Q90 50 85 40" fill="none" stroke="#ffb74d" strokeWidth="2" />
            <circle cx="135" cy="80" r="2.5" fill="#ffeb3b" />
            <circle cx="85" cy="40" r="2.5" fill="#ffeb3b" />
          </svg>
        </div>

        {/* Text Area */}
        <div className="text-center max-w-2xl mx-auto z-10 relative">
          <span className="text-xs uppercase text-gray-500 font-bold tracking-widest block mb-1">About</span>
          <h2 className="text-3xl font-extrabold text-orange-600 m-0 leading-none">Sarguru Crackers</h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4 mb-6"></div>
          
          <p className="text-gray-600 text-sm md:text-[14.5px] leading-relaxed text-justify md:text-center font-normal px-4">
            We are in the field of <strong>manufacturing & Selling crackers since 1994</strong>. We have direct buying customers from Maharastra, Kerala, Karnataka and Tamilnadu. We have 2 manufacturing unit in sivakasi and exclusive showroom with 2 licensed godowns to stock crackers for our customer needs for all occasions throughout the year. We have wide variety of crackers such as sky-shot to fountains color smoke to paper shots. We provide customized fund orders with separate packing and wholesale prices.
          </p>
        </div>
      </section>

      {/* 3. Shop & Gift Boxes Grid */}
      <section className="max-w-5xl mx-auto px-4 mt-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-orange-600 m-0">Our Shop & Gift Boxes</h2>
          <div className="w-24 h-0.5 bg-gray-300 mx-auto mt-4"></div>
        </div>

        {/* 4x2 Grid Gallery Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx} 
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow hover:scale-102 hover:shadow-lg transition-all duration-300 group"
            >
              <img 
                src={img.src} 
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Vision & Mission Statement */}
      <section className="max-w-4xl mx-auto px-4 mt-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-orange-600 m-0">Our Vision & Mission</h2>
          <div className="w-24 h-0.5 bg-gray-300 mx-auto mt-4"></div>
        </div>

        <div className="bg-amber-50/40 border border-amber-200/50 rounded-xl p-8 text-center shadow-sm">
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 font-medium max-w-2xl mx-auto italic">
            "To be the best wholesale & retail dealer for all kind of fancy crackers & giftboxes to our beloved customers."
          </p>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed font-medium max-w-2xl mx-auto italic">
            "Our Mission is to provide Quality & Innovative Fireworks products to our valuable customers at reasonable price and light up all their celebrations."
          </p>
        </div>
      </section>
    </div>
  );
};
