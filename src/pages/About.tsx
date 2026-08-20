import React from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const About: React.FC = () => {
  const { settings } = useSiteSettings();
  const { story, vision, mission } = settings.aboutUs || {};
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
    <div className="flex-grow bg-bg-light pb-20">
      {/* 1. Styled Hero Banner */}
      <section 
        className="relative w-full h-[320px] overflow-hidden flex items-center justify-center px-10 md:px-20 select-none"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(7, 13, 26, 0.4), rgba(7, 13, 26, 0.7)), url('/shop_shelf_1.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        
        {/* Center: Premium Text */}
        <div className="relative z-10 flex flex-col items-center text-center gap-2 animate-slide-up">
          <div className="bg-[#4FC0D0]/20 text-[#A2FF86] font-poppins font-bold text-[10px] md:text-xs px-4 py-1.5 uppercase tracking-[0.3em] rounded-full backdrop-blur-sm border border-[#4FC0D0]/30">
            ESTABLISHED 1994
          </div>
          <h1 className="text-4xl md:text-6xl font-poppins font-black text-white tracking-tight drop-shadow-md select-none mt-2">
            About <span className="text-[#4FC0D0]">Us</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#4FC0D0] to-transparent mt-4"></div>
        </div>
      </section>

      {/* 2. Main About Section */}
      <section className="max-w-5xl mx-auto px-6 mt-16 relative">
        <div className="bg-section-bg rounded-[24px] shadow-[var(--shadow-premium)] p-8 md:p-12 relative z-10 border border-border-gray">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs uppercase text-primary-blue font-bold tracking-widest block mb-2 font-poppins">Our Story</span>
            <h2 className="text-3xl font-poppins font-extrabold text-white m-0 leading-tight">
              Sarguru Crackers
            </h2>
            <div className="w-16 h-1 bg-secondary-gold mx-auto mt-4 mb-8 rounded-full"></div>
            
            <p className="text-text-secondary text-sm md:text-base leading-relaxed text-justify md:text-center font-inter px-4 mb-6 whitespace-pre-line">
              {story}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Shop & Gift Boxes Grid */}
      <section className="max-w-6xl mx-auto px-6 mt-24">
        <div className="text-center mb-12">
          <span className="text-xs uppercase text-primary-blue font-bold tracking-widest block mb-2 font-poppins">Gallery</span>
          <h2 className="text-3xl font-poppins font-black text-white m-0">Our Shop & Gift Boxes</h2>
          <div className="w-24 h-1 bg-secondary-gold mx-auto mt-4 rounded-full"></div>
        </div>

        {/* 4x2 Grid Gallery Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx} 
              className="aspect-square bg-section-bg rounded-[18px] overflow-hidden shadow-sm hover:shadow-[var(--shadow-premium-hover)] hover:-translate-y-1.5 transition-all duration-400 group border border-border-gray"
            >
              <img 
                src={img.src} 
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Vision & Mission Statement */}
      <section className="max-w-4xl mx-auto px-6 mt-24">
        <div className="text-center mb-12">
          <span className="text-xs uppercase text-primary-blue font-bold tracking-widest block mb-2 font-poppins">Core Values</span>
          <h2 className="text-3xl font-poppins font-black text-white m-0">Our Vision & Mission</h2>
          <div className="w-24 h-1 bg-secondary-gold mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-section-bg border-t-[6px] border-secondary-gold rounded-[24px] p-10 md:p-12 text-center shadow-[var(--shadow-premium)] border-x border-b border-border-gray">
          <div className="mb-10 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 bg-section-bg px-4">
              <svg className="w-8 h-8 text-secondary-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
            </div>
            <h4 className="text-primary-blue font-poppins font-bold text-lg mb-3">Vision</h4>
            <p className="text-text-secondary font-inter text-base leading-relaxed max-w-2xl mx-auto italic">
              "{vision}"
            </p>
          </div>
          
          <div className="w-1/2 h-px bg-border-gray mx-auto mb-10"></div>
          
          <div className="relative">
            <h4 className="text-primary-blue font-poppins font-bold text-lg mb-3">Mission</h4>
            <p className="text-text-secondary font-inter text-base leading-relaxed max-w-2xl mx-auto italic">
              "{mission}"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
