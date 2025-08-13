import React from 'react';

const BuyerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="text-gray-600">Welcome to your buyer dashboard</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Matches</h3>
          <p className="text-3xl font-bold text-primary-600">12</p>
          <p className="text-sm text-gray-500">New matches this week</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Deals in Progress</h3>
          <p className="text-3xl font-bold text-success-600">3</p>
          <p className="text-sm text-gray-500">Active negotiations</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Investment Range</h3>
          <p className="text-3xl font-bold text-warning-600">$2.5M</p>
          <p className="text-sm text-gray-500">Average deal size</p>
        </div>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-gray-600">Dashboard content will be implemented here...</p>
      </div>
    </div>
  );
};

export default BuyerDashboard;
