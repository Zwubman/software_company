import React from 'react';
import { motion } from 'framer-motion';
import { X, User, MapPin, Briefcase, Phone, FileText, Calendar, Globe, File } from 'lucide-react';

const OrderDetailPopup = ({ order, onClose }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'pending':
        return 'bg-orange-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gradient-to-r from-[#EB6407] to-[#C05600] text-white">
          <h3 className="text-lg font-semibold">Order Details #{order.id}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5 text-[#EB6407]" /> Personal Information
            </h4>
            <div className="mt-3 space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>
                  <span className="font-medium">Name:</span> {order.fullName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span>
                  <span className="font-medium">Role:</span> {order.roleInSector} ({order.sector})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>
                  <span className="font-medium">Phone 1:</span> {order.phoneNumber1}
                </span>
              </div>
              {order.phoneNumber2 && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>
                    <span className="font-medium">Phone 2:</span> {order.phoneNumber2}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Separator */}
          <hr className="border-gray-200" />

          {/* Address Information */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#EB6407]" /> Address Information
            </h4>
            <div className="mt-3 space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span>
                  <span className="font-medium">Country:</span> {order.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>
                  <span className="font-medium">Location:</span>{' '}
                  {order.country === 'Ethiopia'
                    ? `${order.Region?.name || order.manualRegion} / ${
                        order.Zone?.name || order.manualZone
                      } / ${order.Woreda?.name || order.manualWoreda}`
                    : `${order.manualRegion} / ${order.manualZone} / ${order.manualWoreda}`}
                </span>
              </div>
            </div>
          </div>

          {/* Separator */}
          <hr className="border-gray-200" />

          {/* Order Details */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#EB6407]" /> Order Details
            </h4>
            <div className="mt-3 space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span>
                  <span className="font-medium">Title:</span> {order.orderTitle}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-500 mt-1" />
                <span>
                  <span className="font-medium">Description:</span> {order.shortDescription}
                </span>
              </div>
              {order.requirementFile && (
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-gray-500" />
                  <span>
                    <span className="font-medium">File:</span>{' '}
                    <a
                      href={order.requirementFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View File
                    </a>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailPopup;