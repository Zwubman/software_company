import React from 'react';
import { motion } from 'framer-motion';

const RecentOrders = ({ orderList }) => {
  const recentOrdersList = [...orderList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
      <div className="space-y-4">
        {recentOrdersList.length > 0 ? (
          recentOrdersList.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border border-gray-100 rounded-lg hover:border-[#EB6407] transition-colors"
            >
              <p className="text-sm font-medium text-gray-800">{order.orderTitle}</p>
              <p className="text-xs text-gray-500 mt-1">{order.fullName}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No recent orders</p>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;