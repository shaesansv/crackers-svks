import React, { useState } from 'react';
import type { Customer } from '../AdminDashboard';

interface CustomersProps {
  customers: Customer[];
}

export const Customers: React.FC<CustomersProps> = ({ customers }) => {
  const [customerSearch, setCustomerSearch] = useState('');

  // Filter list
  const filteredCustomers = customers.filter(
    c => c.phone.includes(customerSearch) || c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="select-none">
        <h3 className="text-xl font-bold font-poppins text-dark-navy">Customer Catalog</h3>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">{filteredCustomers.length} unique buyers</p>
      </div>

      <div className="bg-white border border-gray-150 rounded-[20px] shadow-sm overflow-hidden flex flex-col select-none">
        {/* Search customers */}
        <div className="p-5 border-b border-gray-100 bg-[#0B2559]/5 flex items-center gap-3">
          <div className="relative flex-grow max-w-sm">
            <input
              type="text"
              placeholder="Filter by phone number or name..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-[12px] text-sm bg-white text-dark-navy outline-none focus:border-violet-500 font-inter font-semibold"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#5B729E]/10 border-b border-gray-250 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <th className="py-4.5 px-6">Name</th>
                <th className="py-4.5">Phone</th>
                <th className="py-4.5">Location</th>
                <th className="py-4.5 text-center">Orders</th>
                <th className="py-4.5">Total Spent</th>
                <th className="py-4.5">Last Order</th>
                <th className="py-4.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
              {filteredCustomers.map((cust, idx) => (
                <tr key={idx} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-4.5 px-6 text-dark-navy font-bold">{cust.name}</td>
                  <td className="py-4.5 font-inter text-gray-500 font-semibold">{cust.phone}</td>
                  <td className="py-4.5 font-semibold text-gray-400">{cust.location}</td>
                  <td className="py-4.5 text-center font-bold font-inter text-gray-500">{cust.orders}</td>
                  <td className="py-4.5 font-poppins font-extrabold text-[#E51E25] text-base">
                    ₹{cust.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-4.5 font-inter text-gray-400 font-semibold">{cust.lastOrder}</td>
                  <td className="py-4.5 text-center">
                    <button
                      onClick={() =>
                        alert(
                          `Customer History for ${
                            cust.name
                          }:\nTotal Orders placed: ${cust.orders}\nAccumulated Sales: ₹${cust.totalSpent.toLocaleString()}`
                        )
                      }
                      className="px-4 py-1.5 bg-white border border-gray-250 text-dark-navy text-xs font-bold rounded-[8px] hover:bg-gray-50 cursor-pointer outline-none shadow-sm transition-all"
                    >
                      View History
                    </button>
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
