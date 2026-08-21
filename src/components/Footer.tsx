import React from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface Product {
  id: string;
  name: string;
  unit: string;
  actualPrice: number;
  discountPrice: number;
  imageType: string;
  imageUrl?: string;
}

interface FooterProps {
  showCheckout: boolean;
  quantities?: Record<string, number>;
  setCurrentPage: (p: string) => void;
  products?: Product[];
  settings?: any;
}

export const Footer: React.FC<FooterProps> = ({
  showCheckout,
  setCurrentPage
}) => {
  const { settings: siteSettings } = useSiteSettings();

  // Dynamic values from admin content page
  const siteName = siteSettings.siteName || 'Sarguru Crackers';
  const phone = siteSettings.contact?.phone || '+91 78680 77818';
  const storeAddress = siteSettings.contact?.address || '3/1321 Paraipatti, Sivakasi, Tamil Nadu';
  const storeEmail = siteSettings.contact?.email || 'info@sargurucrackers.com';
  return (
    <div className="w-full mt-auto bg-[#FDF5CB]">
      {/* Terms & Conditions Section (Only visible on home page) */}
      {showCheckout && (
        <section className="bg-[#FEF9E1] border-t-2 border-[#B69F4C] py-16 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <h3 className="text-2xl font-poppins font-bold text-[#15803D] text-center mb-10">Terms & Conditions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm text-[#061001] font-inter">
              {(siteSettings.termsAndConditions && siteSettings.termsAndConditions.length > 0
                ? siteSettings.termsAndConditions
                : [
                    'Minimum order value is Rs. 3,000 only (after discount).',
                    'All orders will be dispatched from Sivakasi warehouse.',
                    '3% packing and handling charges will apply on all orders.',
                    'Products will be dispatched only after full payment verification.',
                    'Deliveries will be handled via third-party logistics on a To-Pay basis.',
                    'Order submission is required to process and verify stock availability.',
                    'Images of items in the price list are for visual representations only.',
                    'The prices quoted are valid up to Diwali season or subject to manufacturer changes.'
                  ]
              ).map((term, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#FDF5CB] p-4 rounded-2xl shadow-sm border border-[#B69F4C] hover:border-[#15803D] transition-all duration-300">
                  <div className="w-6 h-6 rounded-full bg-[#15803D] text-[#FDF5CB] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <span className="leading-relaxed font-semibold">{term}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Global Light Green Footer Section */}
      <footer className="bg-[#F0FDF4] text-emerald-900 border-t-2 border-emerald-200/80 select-none font-inter relative overflow-hidden">
        <div className="max-w-6xl mx-auto py-16 px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          
          {/* Column 1: Contact Details */}
          <div className="flex flex-col gap-6">
            <h3 className="text-emerald-950 font-poppins font-bold text-xl mb-2">
              {siteName}
            </h3>
            <div className="flex flex-col gap-4 text-sm text-emerald-800">
              <div className="flex items-start gap-3 hover:text-emerald-950 transition-colors">
                <span className="text-emerald-600 mt-1">📍</span>
                <span className="leading-relaxed">
                  {storeAddress.split(',').slice(0, 2).join(',')}<br />{storeAddress.split(',').slice(2).join(',').trim()}
                </span>
              </div>
              <div className="flex items-center gap-3 hover:text-emerald-950 transition-colors">
                <span className="text-emerald-600">📞</span>
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-3 hover:text-emerald-950 transition-colors">
                <span className="text-emerald-600">✉️</span>
                <span>{storeEmail}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-emerald-950 font-poppins font-bold text-xl mb-2">
              Explore
            </h3>
            <ul className="flex flex-col gap-4 text-sm text-emerald-800">
              {['home', 'about', 'order'].map(page => (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-transparent border-0 text-emerald-800 hover:text-emerald-950 cursor-pointer font-medium p-0 flex items-center gap-2 outline-none text-left transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span className="capitalize">{page.replace('-', ' ')}</span>
                  </button>
                </li>
              ))}
              <li>
                <a href="#safety" className="text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-2 no-underline transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Safety Tips
                </a>
              </li>
              <li>
                <a href="#contact" className="text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-2 no-underline transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Reach Us Map */}
          <div className="flex flex-col gap-6">
            <h3 className="text-emerald-950 font-poppins font-bold text-xl mb-2">
              Location
            </h3>
            <div className="w-full h-40 bg-white rounded-[18px] overflow-hidden shadow-sm relative group border border-emerald-200/80">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.568461531776!2d77.8105!3d9.453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cee4ad2a4cd9%3A0xe21ba24687b8d447!2sParaipatti%2C%20Sivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                className="w-full h-full border-none opacity-90 group-hover:opacity-100 transition-opacity" 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Sarguru Crackers Location Sivakasi"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="bg-emerald-100/70 py-4 text-center border-t border-emerald-200 px-6 text-emerald-800">
          <p className="m-0 text-xs font-medium tracking-wide">
            © {new Date().getFullYear()} {siteName}. All Rights Reserved. | Premium Quality Fireworks from Sivakasi.
          </p>
        </div>
      </footer>
    </div>
  );
};
