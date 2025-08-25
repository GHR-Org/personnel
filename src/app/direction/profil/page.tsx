'use client';

import React, { useState } from 'react';

const Overview = () => {
  const [availableBalance] = useState(14823.20);
  const [pendingBalance] = useState(2498.80);
  const [enterAmount, setEnterAmount] = useState(1482.50);
  const [generalSales] = useState(24000);

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="flex justify-center mb-2">
          <span className="bg-yellow-100 text-yellow-800 rounded-full p-2">💰</span>
        </div>
        <h3 className="text-sm font-medium text-gray-600">Available Balance</h3>
        <p className="text-2xl font-bold mt-2">${availableBalance.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="flex justify-center mb-2">
          <span className="bg-gray-100 text-gray-800 rounded-full p-2">⏳</span>
        </div>
        <h3 className="text-sm font-medium text-gray-600">Pending Balance</h3>
        <p className="text-2xl font-bold mt-2">${pendingBalance.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="space-y-4">
          <input
            type="number"
            value={enterAmount}
            onChange={(e) => setEnterAmount(Number(e.target.value))}
            className="w-full p-2 border rounded-lg text-center"
            placeholder="Enter Amount"
          />
          <button className="w-full bg-yellow-400 text-white p-2 rounded-lg hover:bg-yellow-500">Withdraw Money</button>
          <select className="w-full p-2 border rounded-lg text-center">
            <option>Pay With</option>
            <option>Card 8454 **** **** ****</option>
          </select>
        </div>
      </div>

      <div className="col-span-3 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">General Sale Activity</h3>
        <p className="text-gray-600">Sale Generated <span className="font-medium">${generalSales.toFixed(2)} USD</span></p>
        <div className="h-32 flex items-center mt-2">
          <svg className="w-full h-full" viewBox="0 0 100 32">
            <path d="M10 25 Q 30 10, 50 25 T 90 25" stroke="black" fill="transparent" />
            <circle cx="50" cy="25" r="1.5" fill="yellow" />
          </svg>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
        </div>
      </div>

      <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-4">
            <img src="https://via.placeholder.com/50" alt="Nike" className="w-12 h-12 rounded" />
            <div>
              <p className="text-sm text-gray-700">Nike Air Jordan 1 Zoom Comfort</p>
              <p className="text-green-500 text-sm">$480.50</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <img src="https://via.placeholder.com/50" alt="Zara" className="w-12 h-12 rounded" />
            <div>
              <p className="text-sm text-gray-700">Zara Geometric Print Shirt</p>
              <p className="text-green-500 text-sm">$45.75</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <img src="https://via.placeholder.com/50" alt="Nike" className="w-12 h-12 rounded" />
            <div>
              <p className="text-sm text-gray-700">Nike SB Blazer Court Mid</p>
              <p className="text-green-500 text-sm">$93.00</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Today</h3>
        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Paypal Payment</span>
            <span className="text-sm text-gray-700">Jan 18, 2023 08:20 PM</span>
            <span className="text-sm text-gray-700">$12,340 USD</span>
            <span className="text-green-500 text-sm">Delivered</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Mercury Inc.</span>
            <span className="text-sm text-gray-700">Dec 12, 2022 08:50 PM</span>
            <span className="text-sm text-gray-700">$8,265 USD</span>
            <span className="text-blue-500 text-sm">Transferred</span>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-2xl font-bold text-gray-800">$24,800</p>
          <p className="text-sm text-gray-600">Today Received</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">$1,82,890</p>
          <p className="text-sm text-gray-600">Received Forever</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;