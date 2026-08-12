import { useState, useEffect } from "react";
import { Save, Settings, Loader, RotateCcw } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import type { SiteSettings } from "@/context/SiteSettingsContext";
import { updateSettings as updateSettingsAPI } from "@/lib/api";
import { toast } from "sonner";

const AdminContent = () => {
  const { settings, updateSettings } = useSiteSettings();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleReset = () => {
    setForm(settings);
    toast.info("Changes discarded");
  };

  const handleSave = async () => {
    if (!form.contact?.phone?.trim() || !form.contact?.address?.trim()) {
      toast.error("Please fill in phone and address");
      return;
    }
    if ((form.discountPercent ?? 0) < 0 || (form.discountPercent ?? 0) > 100) {
      toast.error("Discount must be between 0 and 100");
      return;
    }
    setIsSaving(true);
    try {
      await updateSettingsAPI({
        siteName: form.siteName,
        siteDescription: form.siteDescription,
        discountPercent: form.discountPercent,
        minimumPurchaseAmount: form.minimumPurchaseAmount,
        minPurchaseOutsideTN: form.minPurchaseOutsideTN,
        currency: form.currency,
        contact: form.contact,
        socialLinks: form.socialLinks,
        news: form.news,
        enablePackingCharge: form.enablePackingCharge,
      });
      await updateSettings(form);
      toast.success("Settings saved! Changes are now live on the website.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save settings");
      console.error("Failed to update settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const taBase = "w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-[#4FC0D0] focus:border-[#164B60]";

  return (
    <>
      <AdminNavbar />
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">

          {/* ── Page Header with always-visible buttons ── */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                <Settings className="h-6 w-6" style={{ color: '#164B60' }} />
                Content &amp; Settings
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage company information and global settings</p>
            </div>

            {/* Buttons — always rendered, no conditional */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={15} /> Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 22px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isSaving ? '#c2f0b3' : '#A2FF86',
                  color: '#164B60',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(162,255,134,0.4)',
                }}
              >
                {isSaving ? (
                  <><Loader size={15} className="animate-spin" /> Saving...</>
                ) : (
                  <><Save size={15} /> Save Changes</>
                )}
              </button>
            </div>
          </div>

          <div className="max-w-2xl space-y-6">

            {/* ── Site Information ── */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="font-bold text-lg text-gray-900 border-b pb-2">Site Information</h2>
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">Site Name</Label>
                <Input
                  value={form.siteName ?? ""}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  maxLength={100}
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">Site Description</Label>
                <textarea
                  className={taBase}
                  value={form.siteDescription ?? ""}
                  onChange={(e) => setForm({ ...form, siteDescription: e.target.value.slice(0, 300) })}
                  placeholder="Brief description of your business..."
                  rows={3}
                />
                <p className="text-[11px] text-gray-400">{(form.siteDescription ?? "").length}/300 characters</p>
              </div>
            </div>

            {/* ── News / Marquee ── */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="font-bold text-lg text-gray-900 border-b pb-2">📢 News / Announcement Banner</h2>
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">Marquee Text</Label>
                <textarea
                  className={taBase}
                  placeholder="Enter news or announcements to scroll across the top of the home page..."
                  value={form.news ?? ""}
                  onChange={(e) => setForm({ ...form, news: e.target.value })}
                  rows={3}
                />
                <p className="text-[11px] text-gray-400 italic">
                  💡 This scrolling text appears at the top of the home page. Leave blank to hide the banner.
                </p>
              </div>
            </div>

            {/* ── Contact Information ── */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="font-bold text-lg text-gray-900 border-b pb-2">Contact Information</h2>
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">Email</Label>
                <Input
                  type="email"
                  value={form.contact?.email ?? ""}
                  onChange={(e) => setForm({ ...form, contact: { ...form.contact!, email: e.target.value } })}
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">Phone Number</Label>
                <Input
                  value={form.contact?.phone ?? ""}
                  onChange={(e) => setForm({ ...form, contact: { ...form.contact!, phone: e.target.value } })}
                  maxLength={20}
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">Address</Label>
                <textarea
                  className={taBase}
                  value={form.contact?.address ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, contact: { ...form.contact!, address: e.target.value.slice(0, 300) } })
                  }
                  placeholder="Full business address..."
                  rows={3}
                />
              </div>
            </div>

            {/* ── Pricing Settings ── */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="font-bold text-lg text-gray-900 border-b pb-2">Pricing</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">Discount Percentage (%)</Label>
                  <Input
                    type="number" min={0} max={100}
                    value={form.discountPercent ?? 0}
                    onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                    className="bg-white text-gray-900 border-gray-300"
                  />
                  <p className="text-xs text-gray-400">Applied to all discounted products</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">Min Purchase — Inside TN (₹)</Label>
                  <Input
                    type="number" min={0}
                    value={form.minimumPurchaseAmount ?? 0}
                    onChange={(e) => setForm({ ...form, minimumPurchaseAmount: Number(e.target.value) })}
                    className="bg-white text-gray-900 border-gray-300"
                  />
                  <p className="text-[11px] text-gray-400">Minimum order value for TN customers</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">Min Purchase — Outside TN (₹)</Label>
                  <Input
                    type="number" min={0}
                    value={form.minPurchaseOutsideTN ?? 0}
                    onChange={(e) => setForm({ ...form, minPurchaseOutsideTN: Number(e.target.value) })}
                    className="bg-white text-gray-900 border-gray-300"
                  />
                  <p className="text-[11px] text-gray-400">Minimum order value for outside-TN customers</p>
                </div>

                {/* Packing Charge Toggle */}
                <div className="md:col-span-2 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Enable Packing Charge (3%)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Automatically add 3% packing charge to website orders</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.enablePackingCharge ?? true}
                      onClick={() => setForm({ ...form, enablePackingCharge: !(form.enablePackingCharge ?? true) })}
                      style={{
                        position: 'relative',
                        display: 'inline-flex',
                        width: '52px',
                        height: '28px',
                        borderRadius: '9999px',
                        border: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                        background: (form.enablePackingCharge ?? true) ? '#16a34a' : '#d1d5db',
                        transition: 'background 0.2s',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '3px',
                          left: (form.enablePackingCharge ?? true) ? '26px' : '3px',
                          width: '22px',
                          height: '22px',
                          borderRadius: '9999px',
                          background: '#ffffff',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                          transition: 'left 0.2s',
                        }}
                      />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 px-1">
                    Currently:{' '}
                    <span style={{ fontWeight: 700, color: (form.enablePackingCharge ?? true) ? '#16a34a' : '#6b7280' }}>
                      {(form.enablePackingCharge ?? true) ? "Enabled" : "Disabled"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ── Social Links ── */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="font-bold text-lg text-gray-900 border-b pb-2">Social Media Links</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {["facebook", "twitter", "instagram", "youtube"].map((platform) => (
                  <div key={platform} className="space-y-2">
                    <Label className="capitalize font-semibold text-gray-700">{platform}</Label>
                    <Input
                      placeholder={`https://${platform}.com/yourpage`}
                      value={form.socialLinks?.[platform as keyof typeof form.socialLinks] ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, socialLinks: { ...form.socialLinks, [platform]: e.target.value } })
                      }
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Bottom Save Button (duplicate for convenience) ── */}
            <div className="flex justify-end pb-10">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 28px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isSaving ? '#86efac' : '#16a34a',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(22,163,74,0.4)',
                }}
              >
                {isSaving ? (
                  <><Loader size={16} className="animate-spin" /> Saving...</>
                ) : (
                  <><Save size={16} /> Save Changes</>
                )}
              </button>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default AdminContent;
