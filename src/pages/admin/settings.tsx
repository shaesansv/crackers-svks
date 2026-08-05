import React, { useState, useEffect } from 'react';

interface SettingsProps {
  setMessage: (m: string) => void;
  token: string | null;
}

export const Settings: React.FC<SettingsProps> = ({ setMessage, token }) => {
  const [minOrder, setMinOrder] = useState('3000');
  const [whatsappPhone, setWhatsappPhone] = useState('917868077818');
  const [storeAddress, setStoreAddress] = useState('3/1321 Paraipatti, Sivakasi, Tamil Nadu');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load settings from backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setMinOrder(String(data.minOrderValue || '3000'));
            setWhatsappPhone(data.merchantPhone || '917868077818');
            setStoreAddress(data.storeAddress || '3/1321 Paraipatti, Sivakasi, Tamil Nadu');
          }
        }
      } catch (err) {
        console.log('Failed to fetch settings from backend', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          minOrderValue: Number(minOrder),
          merchantPhone: whatsappPhone,
          storeAddress
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMinOrder(String(data.minOrderValue));
        setWhatsappPhone(data.merchantPhone);
        setStoreAddress(data.storeAddress);
        setMessage('Settings saved to database successfully!');
      } else {
        alert('Failed to save settings to server.');
      }
    } catch (err) {
      console.log('Error saving settings:', err);
      alert('Connection error. Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <span className="text-violet-600 font-bold animate-pulse text-sm">Loading configurations...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm max-w-xl animate-fade-in select-none">
      <h3 className="text-lg font-bold font-poppins text-dark-navy mb-4 border-b border-gray-100 pb-2">Store Settings</h3>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-5 text-sm font-medium">
        {/* Min order */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Minimum Order Value (₹) *</label>
          <input
            type="number"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
            required
            className="p-3 border border-gray-200 rounded-[12px] bg-gray-50/30 focus:bg-white text-dark-navy outline-none focus:border-violet-500"
          />
          <p className="text-[10px] text-gray-400">Cart validation will block orders below this threshold.</p>
        </div>

        {/* Whatsapp phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">WhatsApp Redirect Phone Number *</label>
          <input
            type="text"
            value={whatsappPhone}
            onChange={(e) => setWhatsappPhone(e.target.value)}
            required
            className="p-3 border border-gray-200 rounded-[12px] bg-gray-50/30 focus:bg-white text-dark-navy outline-none focus:border-violet-500"
          />
          <p className="text-[10px] text-gray-400">Merchant number (including country code) e.g., 917868077818.</p>
        </div>

        {/* Store address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Warehouse Shipping Address *</label>
          <textarea
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            required
            className="p-3 border border-gray-200 rounded-[12px] bg-gray-50/30 focus:bg-white text-dark-navy outline-none focus:border-violet-500 h-20 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm font-poppins rounded-[12px] py-3.5 shadow-sm transition-all border-none outline-none cursor-pointer mt-2"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};
