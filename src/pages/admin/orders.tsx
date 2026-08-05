import React, { useState } from 'react';
import type { Order } from '../AdminDashboard';

interface OrdersProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  token: string | null;
  fetchData: (token: string) => void;
  setMessage: (m: string) => void;
}

export const Orders: React.FC<OrdersProps> = ({
  orders,
  setOrders,
  token,
  fetchData,
  setMessage
}) => {
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'Approved' | 'Packed' | 'On Hold' | 'Pending'>('all');

  // Toggle order hold/approval status
  const handleUpdateOrderStatus = async (
    orderId: string,
    approvedStatus: 'Pending' | 'Approved' | 'Packed' | 'On Hold',
    holdStatusText: string
  ) => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ approved: approvedStatus, holdStatus: holdStatusText })
      });
      if (response.ok) {
        setMessage('Order status updated successfully!');
        fetchData(token);
      } else {
        // Toggle locally if backend database fails
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, approved: approvedStatus, holdStatus: holdStatusText } : o))
        );
      }
    } catch {
      // Local toggling
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, approved: approvedStatus, holdStatus: holdStatusText } : o))
      );
    }
  };

  // Filter lists
  const filteredOrders = orders.filter(o => {
    const matchesPhone = o.customerPhone.includes(orderSearch);
    const matchesFilter = orderFilter === 'all' || o.approved === orderFilter;
    return matchesPhone && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h3 className="text-xl font-bold font-poppins text-dark-navy">Orders Management</h3>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Showing {filteredOrders.length} orders</p>
        </div>

        {/* Filter headers */}
        <div className="flex flex-wrap gap-2 text-xs font-bold font-poppins">
          {[
            { id: 'all', label: 'All Orders', count: orders.length },
            { id: 'Approved', label: 'Approved', count: orders.filter(o => o.approved === 'Approved').length },
            { id: 'Packed', label: 'Packed', count: orders.filter(o => o.approved === 'Packed').length },
            { id: 'On Hold', label: 'On Hold', count: orders.filter(o => o.approved === 'On Hold').length }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setOrderFilter(btn.id as 'all' | 'Approved' | 'Packed' | 'On Hold' | 'Pending')}
              className={`px-4 py-2 rounded-full cursor-pointer transition-all border-0 flex items-center gap-2 outline-none font-semibold ${
                orderFilter === btn.id
                  ? 'bg-[#E51E25] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{btn.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  orderFilter === btn.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {btn.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders table container */}
      <div className="bg-white border border-gray-150 rounded-[20px] shadow-sm overflow-hidden flex flex-col select-none">
        {/* Search orders */}
        <div className="p-5 border-b border-gray-100 bg-[#0B2559]/5 flex items-center gap-3">
          <div className="relative flex-grow max-w-sm">
            <input
              type="text"
              placeholder="Filter by phone number..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-[12px] text-sm bg-white text-dark-navy outline-none focus:border-violet-500 font-inter font-semibold"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#5B729E]/10 border-b border-gray-250 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <th className="py-4.5 px-6">Order ID</th>
                <th className="py-4.5">Customer</th>
                <th className="py-4.5">Phone</th>
                <th className="py-4.5 text-center">Items</th>
                <th className="py-4.5">Total</th>
                <th className="py-4.5 text-center">Packing</th>
                <th className="py-4.5 text-center">Approved</th>
                <th className="py-4.5 text-center">Hold Status</th>
                <th className="py-4.5">Date</th>
                <th className="py-4.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-4.5 px-6 text-dark-navy font-bold font-inter">{order.orderId}</td>
                  <td className="py-4.5">
                    <div className="min-w-0">
                      <p className="font-extrabold text-dark-navy leading-snug">{order.customerName}</p>
                      <p className="text-[11px] text-gray-400 font-bold mt-0.5 truncate">
                        {order.customerEmail || 'no-email@sarguru.com'}
                      </p>
                    </div>
                  </td>
                  <td className="py-4.5 font-inter text-gray-500 font-semibold">{order.customerPhone}</td>
                  <td className="py-4.5 text-center font-bold font-inter text-gray-500">
                    {order.items.reduce((acc, curr) => acc + curr.qty, 0)}
                  </td>
                  <td className="py-4.5 font-poppins font-extrabold text-[#E51E25] text-base">
                    ₹{order.total.toLocaleString()}
                  </td>
                  <td className="py-4.5 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.packingCharge > 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {order.packingCharge > 0 ? 'Packed' : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4.5 text-center">
                    <select
                      value={order.approved}
                      onChange={e => handleUpdateOrderStatus(order.id, e.target.value as 'Pending' | 'Approved' | 'Packed' | 'On Hold', order.holdStatus)}
                      className="py-1 px-2.5 border border-gray-200 rounded-[8px] text-xs bg-white font-semibold outline-none cursor-pointer focus:border-violet-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Packed">Packed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </td>
                  <td className="py-4.5 text-center">
                    {order.holdStatus ? (
                      <span className="inline-flex flex-col items-center">
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-100">
                          🔥 {order.holdStatus}
                        </span>
                        <span className="text-[8px] text-gray-450 mt-0.5 font-bold">Ready to send!</span>
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="py-4.5 font-inter text-gray-400 font-semibold">{order.date}</td>
                  <td className="py-4.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          alert(
                            `Order Details:\nName: ${order.customerName}\nPhone: ${
                              order.customerPhone
                            }\nItems:\n${order.items
                              .map(i => `• ${i.name} (x${i.qty}) - ₹${i.price * i.qty}`)
                              .join('\n')}\nTotal: ₹${order.total}`
                          );
                        }}
                        className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-[8px] cursor-pointer outline-none"
                      >
                        View Details
                      </button>
                      {order.holdStatus && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, order.approved, '')}
                          className="px-2.5 py-1.5 bg-red-50 border border-red-100 text-[#E51E25] text-xs font-bold rounded-[8px] hover:bg-red-100/50 cursor-pointer outline-none"
                        >
                          Remove Hold
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
