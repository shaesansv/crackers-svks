import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { useEffect, useState } from "react";
import { getOrders, approveOrder, updatePackingStatus, updateHoldDays } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { generateOrderReceiptPDF } from "@/lib/pdf-generator";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Input } from "@/components/ui/input";

/** Returns true when today is BEFORE the hold window expires */
const isOrderOnHold = (order: any): boolean => {
  if (!order.holdDays || order.holdDays <= 0) return false;
  const createdAt = order.createdAt ? new Date(order.createdAt) : null;
  if (!createdAt) return false;
  const holdUntil = new Date(createdAt);
  holdUntil.setDate(holdUntil.getDate() + Number(order.holdDays));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  holdUntil.setHours(0, 0, 0, 0);
  return today < holdUntil;
};

/** Returns true when the hold window has EXPIRED (ready to send) */
const isHoldReady = (order: any): boolean => {
  if (!order.holdDays || order.holdDays <= 0) return false;
  const createdAt = order.createdAt ? new Date(order.createdAt) : null;
  if (!createdAt) return false;
  const holdUntil = new Date(createdAt);
  holdUntil.setDate(holdUntil.getDate() + Number(order.holdDays));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  holdUntil.setHours(0, 0, 0, 0);
  return today >= holdUntil;
};

const AdminOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [orderList, setOrderList] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isApproving, setIsApproving] = useState(false);
  const { settings } = useSiteSettings();

  const downloadPDF = (order: any) => {
    const orderData = {
      orderNumber: order.orderNumber || order._id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress?.fullAddress || order.shippingAddress?.fullAddress || '',
      state: order.deliveryAddress?.state || '',
      district: order.deliveryAddress?.district || '',
      items: order.items.map((i: any) => ({
        ...i,
        productName: i.product?.name || i.productName || 'Product',
        originalPrice: i.originalPrice !== undefined ? i.originalPrice : (i.product?.price || i.price),
        hasDiscount: i.hasDiscount !== undefined ? i.hasDiscount : (i.product?.hasDiscount !== undefined ? i.product.hasDiscount : true),
        netRate: i.netRate !== undefined ? i.netRate : i.product?.netRate,
        displayNetRate: i.displayNetRate !== undefined ? i.displayNetRate : i.product?.displayNetRate
      })),
      subtotal: order.subtotal,
      packingCharge: order.packingCharge || Math.round(order.subtotal * 0.03),
      total: order.total || (order.subtotal + (order.packingCharge || Math.round(order.subtotal * 0.03))),
      date: new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN'),
      discountPercent: settings.discountPercent,
      siteName: settings.siteName,
      siteAddress: settings.contact?.address || '',
      sitePhone: settings.contact?.phone || '',
      siteEmail: settings.contact?.email || '',
    };
    generateOrderReceiptPDF(orderData);
    toast.success("Downloading PDF...");
  };
  const [phoneFilter, setPhoneFilter] = useState("");
  type StatusFilter = 'all' | 'approved' | 'packing' | 'hold';
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isUpdatingPacking, setIsUpdatingPacking] = useState(false);
  const [isUpdatingHold, setIsUpdatingHold] = useState(false);
  const [holdDaysInput, setHoldDaysInput] = useState<number>(0);

  useEffect(() => {
    if (selectedOrder) {
      setHoldDaysInput(selectedOrder.holdDays || 0);
    }
  }, [selectedOrder]);

  const handleUpdateHoldDays = async () => {
    if (!selectedOrder) return;

    try {
      setIsUpdatingHold(true);
      await updateHoldDays(selectedOrder._id, holdDaysInput);
      
      // Update local state lists
      setOrderList((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, holdDays: holdDaysInput } : o
        )
      );
      
      setSelectedOrder((prev: any) => ({ ...prev, holdDays: holdDaysInput }));
      toast.success(`Hold duration updated to ${holdDaysInput} days!`);
    } catch (error) {
      console.error("Error updating hold days:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update hold days");
    } finally {
      setIsUpdatingHold(false);
    }
  };

  const handleRemoveHold = async (orderId: string) => {
    try {
      await updateHoldDays(orderId, 0);
      setOrderList((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, holdDays: 0 } : o
        )
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, holdDays: 0 }));
      }
      toast.success(`Hold removed successfully!`);
    } catch (error) {
      console.error("Error removing hold:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove hold");
    }
  };

  useEffect(() => {
    getOrders().then(setOrderList).catch(() => setOrderList([]));
  }, []);

  const handleApproveOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      setIsApproving(true);
      await approveOrder(selectedOrder._id);
      
      // Update local state
      setOrderList((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, approved: true } : o
        )
      );
      
      setSelectedOrder((prev: any) => ({ ...prev, approved: true }));
      toast.success("Order approved and customer updated!");
    } catch (error) {
      console.error("Error approving order:", error);
      toast.error(error instanceof Error ? error.message : "Failed to approve order");
    } finally {
      setIsApproving(false);
    }
  };

  const handleTogglePackingStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      setIsUpdatingPacking(true);
      const newStatus = selectedOrder.packingStatus === 'packed' ? 'unpacked' : 'packed';
      await updatePackingStatus(selectedOrder._id, newStatus);
      
      // Update local state
      setOrderList((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, packingStatus: newStatus } : o
        )
      );
      
      setSelectedOrder((prev: any) => ({ ...prev, packingStatus: newStatus }));
      toast.success(`Order marked as ${newStatus}!`);
    } catch (error) {
      console.error("Error updating packing status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update packing status");
    } finally {
      setIsUpdatingPacking(false);
    }
  };

  // Per-tab counts (based only on phone filter, not status filter)
  const phoneFiltered = orderList.filter((o) =>
    o.customerPhone?.toLowerCase().includes(phoneFilter.toLowerCase())
  );
  const tabCounts = {
    all: phoneFiltered.length,
    approved: phoneFiltered.filter((o) => o.approved).length,
    packing: phoneFiltered.filter((o) => o.packingStatus === 'packed').length,
    // Count any order where admin set hold days (> 0)
    hold: phoneFiltered.filter((o) => o.holdDays && Number(o.holdDays) > 0).length,
  };

  const filteredOrders = phoneFiltered
    .filter((o) => {
      if (statusFilter === 'approved') return o.approved;
      if (statusFilter === 'packing') return o.packingStatus === 'packed';
      // Show any order where admin set hold days (> 0), active or expired
      if (statusFilter === 'hold') return o.holdDays && Number(o.holdDays) > 0;
      return true;
    })
    .sort((a, b) => {
      // Ready (expired) hold orders float to the absolute top
      const aReady = isHoldReady(a) ? 1 : 0;
      const bReady = isHoldReady(b) ? 1 : 0;
      if (bReady !== aReady) return bReady - aReady;

      // Active hold orders float to the top
      const aOnHold = isOrderOnHold(a) ? 1 : 0;
      const bOnHold = isOrderOnHold(b) ? 1 : 0;
      if (bOnHold !== aOnHold) return bOnHold - aOnHold;
      // Within the same group, newest first
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedData = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  

  return (
    <>
      <AdminNavbar />
      <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold">Orders</h1>
          <Link to="/" className="text-sm text-primary hover:underline lg:hidden">← Store</Link>
        </div>

        {/* Filter tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {([
            { key: 'all',      label: 'All Orders',  icon: '📋', activeClass: 'bg-primary text-primary-foreground border-primary' },
            { key: 'approved', label: 'Approved',     icon: '✅', activeClass: 'bg-green-600 text-white border-green-600' },
            { key: 'packing',  label: 'Shipped',      icon: '🚚', activeClass: 'bg-teal-600 text-white border-teal-600' },
            { key: 'hold',     label: 'On Hold',      icon: '🔒', activeClass: 'bg-amber-500 text-white border-amber-500' },
          ] as { key: StatusFilter; label: string; icon: string; activeClass: string }[]).map(({ key, label, icon, activeClass }) => (
            <button
              key={key}
              onClick={() => { setStatusFilter(key); setCurrentPage(1); }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                statusFilter === key
                  ? activeClass
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
              <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                statusFilter === key ? 'bg-white/20' : 'bg-secondary'
              }`}>
                {tabCounts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Phone search + count */}
        <div className="mb-6 flex gap-3 flex-wrap items-center">
          <input
            type="text"
            placeholder="Filter by phone number..."
            value={phoneFilter}
            onChange={(e) => { setPhoneFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border border-border rounded-md bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1 max-w-xs"
          />
          {phoneFilter && (
            <button
              onClick={() => setPhoneFilter("")}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
          <span className="px-3 py-2 text-sm text-muted-foreground">Showing {filteredOrders.length} orders</span>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left p-3">Order ID</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-right p-3 hidden sm:table-cell">Items</th>
                  <th className="text-right p-3">Total</th>
                  <th className="text-center p-3">Shipping</th>
                  <th className="text-center p-3">Approved</th>
                  <th className="text-right p-3 hidden md:table-cell">Date</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((o) => {
                  const onHold = isOrderOnHold(o);
                  const isReady = isHoldReady(o);
                  return (
                  <tr
                    key={o._id}
                    className={`border-b transition-colors ${
                      isReady
                        ? "bg-red-500/10 border-l-4 border-l-red-500 hover:bg-red-500/20"
                        : onHold
                        ? "bg-amber-500/10 border-l-4 border-l-amber-500 hover:bg-amber-500/20"
                        : "border-border hover:bg-secondary/30"
                    }`}
                  >
                    <td className="p-3 font-semibold">{o.orderNumber || o._id?.slice(-8)}</td>
                    <td className="p-3">
                      <p>{o.customerName}</p>
                      <p className="text-xs text-muted-foreground">{o.customerEmail}</p>
                    </td>
                    <td className="p-3 text-sm">{o.customerPhone}</td>
                    <td className="p-3 text-right hidden sm:table-cell">{o.items?.length || 0}</td>
                    <td className="p-3 text-right font-bold text-primary">₹{Number(o.subtotal) + (Number(o.packingCharge) || 0)}</td>
                    <td className="p-3 text-center">
                      {o.packingStatus === 'packed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500 text-white shadow-sm">
                          🚚 Shipped
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                          ⏳ Not Shipped
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {o.approved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-sm">
                          ✓ Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300">
                          ⏸ Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right text-muted-foreground hidden md:table-cell text-xs">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex flex-col gap-1 items-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrder(o)}
                          className="text-xs w-full max-w-[100px]"
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-card border-t border-border mt-4 rounded-b-lg">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredOrders.length)} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                <div className="text-sm font-medium">Page {currentPage} of {Math.max(1, totalPages)}</div>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-700 shadow-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Order ID: {selectedOrder?.orderNumber || selectedOrder?._id?.slice(-8)}</DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Customer Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                      <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                      <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                      {selectedOrder.alternatePhoneNumber && (
                        <p><strong>Alternate Phone:</strong> {selectedOrder.alternatePhoneNumber}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-2">Order Summary</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Subtotal:</strong> ₹{selectedOrder.subtotal}</p>
                      <p><strong>Packing Charges (3%):</strong> ₹{selectedOrder.packingCharge || Math.round(Number(selectedOrder.subtotal) * 0.03)}</p>
                      <p className="text-green-600 text-xs italic"><strong>Delivery Charges:</strong> Excluded</p>
                      <p className="font-bold"><strong>Total:</strong> ₹{Number(selectedOrder.subtotal) + (Number(selectedOrder.packingCharge) || Math.round(Number(selectedOrder.subtotal) * 0.03))}</p>
                      <p><strong>Status:</strong> {selectedOrder.status}</p>
                      <p><strong>Packing Status:</strong> {selectedOrder.packingStatus ? (selectedOrder.packingStatus === 'packed' ? '📦 Packed' : '🔹 Unpacked') : 'Not set'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200">Delivery Address</h3>
                  <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-3 rounded-lg">
                    <p>{selectedOrder.deliveryAddress?.fullAddress || selectedOrder.shippingAddress?.fullAddress || "No address provided"}</p>
                    {selectedOrder.deliveryAddress?.district && <p className="mt-1"><strong>District:</strong> {selectedOrder.deliveryAddress.district}</p>}
                    {selectedOrder.deliveryAddress?.state && <p className="mt-1"><strong>State:</strong> {selectedOrder.deliveryAddress.state}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200">Items Ordered</h3>
                  <div className="bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300">
                          <th className="text-left px-3 py-2 font-semibold">#</th>
                          <th className="text-left px-3 py-2 font-semibold">Product</th>
                          <th className="text-center px-3 py-2 font-semibold">Qty</th>
                          <th className="text-right px-3 py-2 font-semibold">Price</th>
                          <th className="text-right px-3 py-2 font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item: any, idx: number) => (
                          <tr key={idx} className="border-t border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-gray-200">
                            <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                            <td className="px-3 py-2 font-medium">{item.product?.name || item.productName || 'Product'}</td>
                            <td className="px-3 py-2 text-center">{item.quantity}</td>
                            <td className="px-3 py-2 text-right">₹{item.price}</td>
                            <td className="px-3 py-2 text-right font-semibold">₹{(item.quantity * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>



                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => downloadPDF(selectedOrder)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    📄 Download PDF
                  </Button>
                  {!selectedOrder.approved && (
                    <Button
                      onClick={handleApproveOrder}
                      disabled={isApproving}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isApproving ? "Approving..." : "Approve & Update Customer"}
                    </Button>
                  )}
                  {selectedOrder.approved && (
                    <Button variant="default" disabled className="flex-1">
                      ✓ Already Approved
                    </Button>
                  )}
                  {selectedOrder.approved && (
                    <Button
                      onClick={handleTogglePackingStatus}
                      disabled={isUpdatingPacking}
                      className={`flex-1 ${selectedOrder.packingStatus === 'packed' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-teal-600 hover:bg-teal-700'} text-white`}
                    >
                      {isUpdatingPacking ? "Updating..." : selectedOrder.packingStatus === 'packed' ? '⏳ Mark Not Shipped' : '🚚 Mark Shipped'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        </main>
      </div>
    </>
  );
}

export default AdminOrders;