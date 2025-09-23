import React from "react";
import { motion } from "framer-motion";
import { X, Info, Mail, Phone, User, Briefcase } from "lucide-react";

const PartnershipDetail = ({ partnership, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-lg px-6 w-full max-w-xl mx-4 py-4 md:py-2 "
      >
        <div className="flex justify-between items-center mb-4  md:py-2 ">
          <h2 className="text-xl font-bold text-[#EB6407]">
            Partnership Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="">
          <div className="flex justify-center items-center">
            {partnership?.user?.profilePicture && (
              <img
                src={partnership?.user?.profilePicture}
                alt=""
                className="w-20 h-20 md:w-40 md:h-40 rounded-full"
              />
            )}
          </div>
          <div className="flex flex-col md:flex-row">
            <DetailItem
              icon={<User className="h-5 w-5 text-[#EB6407] mr-2" />}
              label="Full Name:"
              value={partnership.fullName}
            />
            <DetailItem
              icon={
                <span className="h-5 w-5 text-[#EB6407] mr-2 text-4xl text-bold">
                  {partnership.sex === "female" ? "♀️" : "♂️"}
                </span>
              }
              label="Gender:"
              value={partnership.sex}
            />
          </div>
          <div className="flex flex-col md:flex-row">
            <DetailItem
              icon={<Briefcase className="h-5 w-5 text-[#EB6407] mr-2" />}
              label="Profession:"
              value={partnership.profession}
            />
            <DetailItem
              icon={<Info className="h-5 w-5 text-[#EB6407] mr-2" />}
              label="Ability for Partnership:"
              value={partnership.abilityForPartnership}
            />
          </div>

          {partnership.abilityDescription && (
            <DetailItem
              icon={<Info className="h-5 w-5 text-[#EB6407] mr-2" />}
              label="Ability Description:"
              value={partnership.abilityDescription}
              colSpan="col-span-2"
            />
          )}
          <div className="flex flex-col md:flex-row">
            <DetailItem
              icon={<Mail className="h-5 w-5 text-[#EB6407] mr-2" />}
              label="Email:"
              value={partnership.email}
            />
            <DetailItem
              icon={<Phone className="h-5 w-5 text-[#EB6407] mr-2" />}
              label="Phone Number:"
              value={partnership.phoneNumber}
            />
          </div>
          {/* <DetailItem
            icon={<Info className="h-5 w-5 text-[#EB6407] mr-2" />}
            label="Status:"
            value={
              partnership.status.charAt(0).toUpperCase() +
              partnership.status.slice(1)
            }
          /> */}
          <div className=" flex-col md:flex-row hidden lg:flex">
            <DetailItem
              icon={<Info className="h-5 w-5 text-[#EB6407] mr-2" />}
              label="Created At:"
              value={new Date(partnership.createdAt).toLocaleString()}
            />
            <DetailItem
              icon={<Info className="h-5 w-5 text-[#EB6407] mr-2" />}
              label="Updated At:"
              value={new Date(partnership.updatedAt).toLocaleString()}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DetailItem = ({ icon, label, value, colSpan }) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-md flex items-center ${
        colSpan ? colSpan : ""
      } w-full`}
    >
      {icon}
      <div className="ml-2">
        <strong>{label}</strong>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default PartnershipDetail;
