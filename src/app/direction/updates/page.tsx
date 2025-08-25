import React from 'react';

const Updates = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow animate-slideInRight">
      <h3 className="text-lg font-semibold">Recent Updates</h3>
      <ul className="mt-3 space-y-2">
        <li className="text-sm animate-fadeInUp">New payment method added: Crypto Wallet</li>
        <li className="text-sm animate-fadeInUp delay-100">Stock update for Nike products</li>
        <li className="text-sm animate-fadeInUp delay-200">System maintenance scheduled for July 5, 2025</li>
        <li className="text-sm animate-fadeInUp delay-300">User management interface improved</li>
      </ul>
    </div>
  );
};

export default Updates;