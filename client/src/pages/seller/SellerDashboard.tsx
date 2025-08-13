import React from 'react';

const SellerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-600">Welcome to your seller dashboard</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Views</h3>
          <p className="text-3xl font-bold text-primary-600">45</p>
          <p className="text-sm text-gray-500">Views this week</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interest Requests</h3>
          <p className="text-3xl font-bold text-success-600">8</p>
          <p className="text-sm text-gray-500">New inquiries</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Asking Price</h3>
          <p className="text-3xl font-bold text-warning-600">$3.2M</p>
          <p className="text-sm text-gray-500">Current listing</p>
        </div>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-gray-600">Dashboard content will be implemented here...</p>
      </div>
    </div>
  );
};

export default SellerDashboard;
