import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../lib/api';

export interface SiteSettings {
  siteName: string;
  siteDescription?: string;
  logo?: string;
  favicon?: string;
  discountPercent: number;
  minimumPurchaseAmount: number;
  minPurchaseOutsideTN: number;
  freeDeliveryThreshold?: number;
  deliveryCharge?: number;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
  news?: string;
  currency?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  billing?: {
    companyName?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    gstNumber?: string;
    applyGst?: boolean;
  };
  enablePackingCharge?: boolean;
  aboutUs?: {
    story?: string;
    vision?: string;
    mission?: string;
  };
  safetyTips?: {
    intro?: string;
    dos?: string[];
    donts?: string[];
  };
  termsAndConditions?: string[];
}

const defaultSettings: SiteSettings = {
  siteName: 'Sarguru Crackers',
  discountPercent: 80,
  minimumPurchaseAmount: 3000,
  minPurchaseOutsideTN: 5000,
  enablePackingCharge: true,
  currency: 'INR',
  contact: {
    phone: '+91 78680 77818',
    address: 'Sivakasi, Tamil Nadu',
    email: 'info@sargurucrackers.com'
  },
  billing: {
    companyName: 'Sarguru Crackers',
    phone: '+91 78680 77818',
    whatsapp: '+91 78680 77818',
    gstNumber: '',
    applyGst: false
  },
  aboutUs: {
    story: 'We are in the field of manufacturing & selling crackers since 1994. We have direct buying customers from Maharashtra, Kerala, Karnataka, and Tamil Nadu. We have 2 manufacturing units in Sivakasi and an exclusive showroom with 2 licensed godowns to stock crackers for our customer needs for all occasions throughout the year.\nWe have a wide variety of crackers such as sky-shots to fountains, color smoke to paper shots. We provide customized fund orders with separate packing and wholesale prices.',
    vision: 'To be the best wholesale & retail dealer for all kinds of fancy crackers & gift boxes to our beloved customers.',
    mission: 'Our Mission is to provide Quality & Innovative Fireworks products to our valuable customers at reasonable prices and light up all their celebrations.'
  },
  safetyTips: {
    intro: 'There are certain Do\'s & Don\'ts to follow while purchasing, bursting and storing crackers. Thus, it is very important to follow the precautions while bursting crackers.',
    dos: [
      "Display fireworks as per the warnings and instructions mentioned on the pack.",
      "Buy fireworks directly from Manufacturer or from authorized dealer only.",
      "Always follow the Safety tips marked on the fireworks.",
      "Use an agarbatti to ignite the fireworks.",
      "Always wear eye protection when lightening fireworks.",
      "Keep a bucket of water or a garden hose handy in case of fire or other mishap."
    ],
    donts: [
      "Never try to re-light or pick up fireworks that have not ignited fully.",
      "Never shoot fireworks in a metal or glass containers.",
      "Never point or throw fireworks at another person.",
      "Do not wear loose clothing while using fireworks.",
      "Never carry fireworks in your pockets.",
      "After fireworks display never pick up fireworks that may be left over, they may still active."
    ]
  },
  termsAndConditions: [
    'Minimum order value is Rs. 3,000 only (after discount).',
    'All orders will be dispatched from Sivakasi warehouse.',
    '3% packing and handling charges will apply on all orders.',
    'Products will be dispatched only after full payment verification.',
    'Deliveries will be handled via third-party logistics on a To-Pay basis.',
    'Order submission is required to process and verify stock availability.',
    'Images of items in the price list are for visual representations only.',
    'The prices quoted are valid up to Diwali season or subject to manufacturer changes.'
  ]
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    try {
      localStorage.setItem('site_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings/public/info`);
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => {
          const updated = { ...prev, ...data };
          try { localStorage.setItem('site_settings', JSON.stringify(updated)); } catch {}
          return updated;
        });
      }
    } catch (err) {
      console.log('Failed to fetch site settings', err);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchWithAbort = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings/public/info`, {
          signal: controller.signal,
        });
        if (response.ok) {
          const data = await response.json();
          setSettings(prev => {
            const updated = { ...prev, ...data };
            try { localStorage.setItem('site_settings', JSON.stringify(updated)); } catch {}
            return updated;
          });
        }
      } catch (err: any) {
        // AbortError is expected on unmount — not a real error
        if (err?.name !== 'AbortError') {
          console.log('Failed to fetch site settings', err);
        }
      }
    };

    fetchWithAbort();

    return () => {
      controller.abort(); // Cancel fetch if provider unmounts
    };
  }, []);

  const updateSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    try { localStorage.setItem('site_settings', JSON.stringify(newSettings)); } catch {}
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, refreshSettings: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
