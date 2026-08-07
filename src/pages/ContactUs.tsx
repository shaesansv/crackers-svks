import React from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const ContactUs: React.FC = () => {
  const { settings } = useSiteSettings();
  const phone = settings.contact?.phone || '+91 78680 77818';
  const address = settings.contact?.address || '3/1321 Paraipatti, Sivakasi, Tamil Nadu, India';
  const email = settings.contact?.email || 'info@sargurucrackers.com';
  const siteName = settings.siteName || 'Sarguru Crackers';

  return (
    <div className="flex-grow bg-bg-light pb-0 flex flex-col">
      {/* Hero Banner Section */}
      <section
        className="relative w-full h-[250px] md:h-[320px] overflow-hidden flex items-center justify-center px-10 md:px-20 select-none"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(15, 76, 129, 0.85), rgba(30, 58, 138, 0.95)), url('/gift_box_1.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-64 bg-secondary-gold/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 border-[40px] border-secondary-gold/10 rounded-full pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 border-[30px] border-secondary-gold/5 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center gap-2 animate-slide-up">
          <div className="bg-secondary-gold/20 text-secondary-gold font-poppins font-bold text-[10px] md:text-xs px-4 py-1.5 uppercase tracking-[0.3em] rounded-full backdrop-blur-sm border border-secondary-gold/30">
            GET IN TOUCH
          </div>
          <h1 className="text-4xl md:text-6xl font-poppins font-black text-white tracking-tight drop-shadow-md select-none mt-2">
            Contact <span className="text-secondary-gold">Us</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-secondary-gold to-transparent mt-4"></div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-16 md:mt-24 mb-16 md:mb-24 w-full">
        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address */}
          <div className="bg-white rounded-[24px] shadow-[var(--shadow-premium)] border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-[var(--shadow-premium-hover)] hover:-translate-y-1.5 transition-all duration-400 group">
            <div className="w-16 h-16 rounded-full bg-bg-light border border-border-gray flex items-center justify-center mb-6 group-hover:bg-secondary-gold/10 transition-colors">
              <svg className="w-8 h-8 text-primary-blue group-hover:text-secondary-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 className="font-poppins font-bold text-xl text-text-primary mb-3">Address</h3>
            <p className="text-gray-600 font-inter text-sm leading-relaxed whitespace-pre-line">
              <strong>{siteName}</strong><br />
              {address}
            </p>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-[24px] shadow-[var(--shadow-premium)] border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-[var(--shadow-premium-hover)] hover:-translate-y-1.5 transition-all duration-400 group">
            <div className="w-16 h-16 rounded-full bg-bg-light border border-border-gray flex items-center justify-center mb-6 group-hover:bg-secondary-gold/10 transition-colors">
              <svg className="w-8 h-8 text-primary-blue group-hover:text-secondary-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <h3 className="font-poppins font-bold text-xl text-text-primary mb-3">Phone</h3>
            <p className="text-gray-600 font-inter text-sm leading-relaxed">
              Sales &amp; Support<br />
              <a href={`tel:${phone}`} className="text-primary-blue text-lg font-bold mt-1 block hover:underline">
                {phone}
              </a>
            </p>
          </div>

          {/* Email */}
          <div className="bg-white rounded-[24px] shadow-[var(--shadow-premium)] border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-[var(--shadow-premium-hover)] hover:-translate-y-1.5 transition-all duration-400 group">
            <div className="w-16 h-16 rounded-full bg-bg-light border border-border-gray flex items-center justify-center mb-6 group-hover:bg-secondary-gold/10 transition-colors">
              <svg className="w-8 h-8 text-primary-blue group-hover:text-secondary-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="font-poppins font-bold text-xl text-text-primary mb-3">Email Us</h3>
            <p className="text-gray-600 font-inter text-sm leading-relaxed mb-4">
              Send us your queries anytime!<br />
              <a href={`mailto:${email}`} className="text-primary-blue font-bold hover:underline break-all">
                {email}
              </a>
            </p>
            <div className="flex gap-4 mt-auto">
              {settings.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-bg-light border border-border-gray hover:bg-primary-blue hover:border-primary-blue hover:text-white flex items-center justify-center text-gray-500 transition-all shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-bg-light border border-border-gray hover:bg-primary-blue hover:border-primary-blue hover:text-white flex items-center justify-center text-gray-500 transition-all shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="w-full h-[400px] bg-gray-200 mt-auto">
        <iframe
          title="Sarguru Crackers Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15740.063230674205!2d77.7845!3d9.4534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cee43b811239%3A0x8e83be6ab31668e1!2sSivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1689332014120!5m2!1sen!2sin"
          className="w-full h-full border-none grayscale hover:grayscale-0 transition-all duration-700"
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};
