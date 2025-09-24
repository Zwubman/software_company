import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const Notification = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
      type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
    }`}
  >
    {type === 'error' ? <AlertCircle className="h-5 w-5" /> : null}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
      <X className="h-4 w-4" />
    </button>
  </motion.div>
);

export default Notification;