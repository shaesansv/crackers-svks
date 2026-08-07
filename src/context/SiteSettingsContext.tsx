import React, { createContext, useContext, useState, useEffect } from 'react';

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
  }
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings/public/info');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.log('Failed to fetch site settings', err);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchWithAbort = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/settings/public/info', {
          signal: controller.signal,
        });
        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({ ...prev, ...data }));
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
