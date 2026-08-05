import React from 'react';
import type { Order, Product, Customer } from '../AdminDashboard';

interface DashboardProps {
  orders: Order[];
  products: Product[];
  customers: Customer[];
}

export const Dashboard: React.FC<DashboardProps> = ({ orders, products, customers }) => {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Revenue',
            value: `₹${orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}`,
            color: 'border-l-violet-500 text-violet-600 bg-violet-50/20'
          },
          {
            label: 'Total Orders',
            value: orders.length,
            color: 'border-l-blue-500 text-blue-600 bg-blue-50/20'
          },
          {
            label: 'Total Catalog Products',
            value: products.length,
            color: 'border-l-orange-500 text-orange-600 bg-orange-50/20'
          },
          {
            label: 'Unique Customers',
            value: customers.length,
            color: 'border-l-emerald-500 text-emerald-600 bg-emerald-50/20'
          }
        ].map((card, idx) => (
          <div key={idx} className={`bg-white border border-gray-150 border-l-[5px] rounded-[16px] p-5 shadow-sm ${card.color.split(' ')[0]}`}>
            <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase font-inter">{card.label}</span>
            <h3 className="text-2xl font-extrabold font-poppins mt-2 text-dark-navy">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Orders table */}
      <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm">
        <h3 className="text-lg font-bold font-poppins text-dark-navy mb-4 border-b border-gray-100 pb-3">Recent Sales Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Total Amount</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 text-violet-600 font-bold font-inter">#{order.orderId}</td>
                  <td className="py-3.5 text-dark-navy font-bold">{order.customerName}</td>
                  <td className="py-3.5 font-inter text-gray-400">{order.date}</td>
                  <td className="py-3.5 font-poppins font-extrabold text-[#EA580C]">₹{order.total.toLocaleString()}</td>
                  <td className="py-3.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      order.approved === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                      order.approved === 'Packed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      order.approved === 'On Hold' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      'bg-gray-50 text-gray-500 border-gray-100'
                    }`}>
                      {order.approved}
                    </span>
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
