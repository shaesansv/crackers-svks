import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  minOrderValue?: number;
  merchantPhone?: string;
  storeAddress?: string;
  [key: string]: any;
}

interface SettingsContextType {
  settings: Settings | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);

  const refreshSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings/public/info');
      if (response.ok) {
        const data = await response.json();
        setSettings({
          minOrderValue: data.minimumPurchaseAmount,
          merchantPhone: data.contact?.phone,
          storeAddress: data.contact?.address,
          ...data
        });
      }
    } catch (err) {
      console.log('Failed to fetch settings in SettingsContext', err);
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
          setSettings({
            minOrderValue: data.minimumPurchaseAmount,
            merchantPhone: data.contact?.phone,
            storeAddress: data.contact?.address,
            ...data
          });
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.log('Failed to fetch settings in SettingsContext', err);
        }
      }
    };

    fetchWithAbort();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
