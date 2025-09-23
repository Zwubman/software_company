import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, Loader2, X } from "lucide-react";
import { useSelector } from "react-redux";

import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import {
  getAllServices,
  deleteService,
  createService,
  updateService,
} from "../../services/ServiceService";
import { AiOutlineClose } from "react-icons/ai";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 ${className}`} />
);

const AdminService = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: null,
    videoUrl: null,
    fileUrl: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const { user } = useSelector((state) => state.userData);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter((service) =>
      ["title", "description"].some((field) =>
        service[field]?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredServices(filtered);
  }, [searchQuery, services]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await getAllServices();
      setServices(response?.services?.services);
      setFilteredServices(response?.services?.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "image") {
      setFormData({ ...formData, imageUrl: file });
      setImagePreview(URL.createObjectURL(file));
    } else if (type === "video") {
      setFormData({ ...formData, videoUrl: file });
      setVideoPreview(URL.createObjectURL(file));
    } else if (type === "file") {
      setFormData({ ...formData, fileUrl: file });
      setFilePreview(URL.createObjectURL(file));
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const filtered = services.filter((service) =>
      ["title", "description"].some((field) =>
        service[field]?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredServices(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);

    try {
      await deleteService(serviceId);
      fetchServices(); // Refresh the services list
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setDeleteDialogOpen(false);
      setIsLoading(false); // Reset loading state after fetching
    }
  };
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);

    // Append files only if they exist
    if (formData.imageUrl) data.append("imageUrl", formData.imageUrl);
    else data.append("imageUrl", ""); // Ensure null is sent if removed

    if (formData.videoUrl) data.append("videoUrl", formData.videoUrl);
    else data.append("videoUrl", ""); // Ensure null is sent if removed

    if (formData.fileUrl) data.append("fileUrl", formData.fileUrl);
    else data.append("fileUrl", ""); // Ensure null is sent if removed

    try {
      if (currentService) {
        await updateService(currentService.id, data);
      } else {
        await createService(data);
      }
      fetchServices(); // Refresh the services list after creation or update
      setIsModalOpen(false);
      resetForm(); // Reset state after submission
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl,
      videoUrl: service.videoUrl,
      fileUrl: service.fileUrl,
    });
    setImagePreview(service.imageUrl ? service.imageUrl : null);
    setVideoPreview(service.videoUrl ? service.videoUrl : null);
    setFilePreview(service.fileUrl ? service.fileUrl : null);

    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      description: "",
      imageUrl: null,
      videoUrl: null,
      fileUrl: null,
    });
    setImagePreview(null);
    setFilePreview(null);
    setVideoPreview(null);
    setCurrentService(null);
  };

  const handleDelete = (id) => {
    setServiceId(id);
    setDeleteDialogOpen(true);
  };

  const handleRemoveExistingImage = (type) => {
    if (type === "image") {
      setFormData({ ...formData, imageUrl: null });
      setImagePreview(null);
    } else if (type === "video") {
      setFormData({ ...formData, videoUrl: null });
      setVideoPreview(null);
    } else {
      setFormData({ ...formData, fileUrl: null });
      setFilePreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Service Management
        </h1>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search services..."
                className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
              />
            </div>

            {user?.role == "admin" && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Add New Service</span>
              </button>
            )}
          </form>
        </div>
        <div className="grid grid-cols-1 ">
          {isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-md"
                >
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </>
          ) : filteredServices.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-4 text-gray-500">
              <p className="text-lg font-semibold">No Services Available</p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <motion.div
                key={service.id}
                className="bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-bold text-[#EB6407] mb-2">
                  {service.title}
                </h3>

                <div className="flex flex-col lg:flex-row lg:divide-x lg:divide-gray-200">
                  <div className="flex-1 p-4">
                    <p className="text-gray-700">
                      {expandedServiceId === service.id
                        ? service.description
                        : `${service.description.substring(0, 500)} `}
                      {service.description.length > 500 && (
                        <button
                          onClick={() =>
                            setExpandedServiceId(
                              expandedServiceId === service.id
                                ? null
                                : service.id
                            )
                          }
                          className="text-[#EB6407] hover:text-[#C05600] font-semibold"
                        >
                          {expandedServiceId === service.id
                            ? "Show Less"
                            : "Show More"}
                        </button>
                      )}
                    </p>

                    {service.fileUrl && (
                      <div className="mt-2 ">
                        <a
                          href={service.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Preview File
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-4 ">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt="Service Image"
                        className="rounded-lg w-full h-48 object-cover my-4"
                      />
                    ) : (
                      <div className="flex items-center justify-center bg-gray-200 rounded-lg h-48 ">
                        <p className="text-gray-500">Image Not Found</p>
                      </div>
                    )}

                    {service.videoUrl && (
                      <video
                        src={service.videoUrl}
                        controls
                        className="rounded-lg w-full h-48 object-cover "
                      />
                    )}
                  </div>
                </div>

                {user?.role === "admin" && (
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(service)}
                      className="flex items-center justify-center px-4 py-2 bg-[#19274a] text-white rounded-md hover:bg-[#205080] transition-colors"
                    >
                      <Edit className="h-5 w-5 mr-1" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(service.id)}
                      className="flex items-center justify-center px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
                    >
                      <Trash2 className="h-5 w-5 mr-1" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {currentService ? "Edit Service" : "Create New Service"}
                    </h2>
                    <button
                      onClick={() => {
                        resetForm();
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title*
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description*
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        rows="4"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium">File:</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "file")}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                      {filePreview && (
                        <div className="relative ">
                          <motion.a
                            href={filePreview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 block text-blue-600 underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Preview File
                          </motion.a>
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage("file")}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-md p-1 hover:bg-red-600"
                          >
                            remove file
                          </button>{" "}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 flex flex-col md:flex-row md:space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium">
                          Image:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "image")}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        {imagePreview && (
                          <div className="relative aspect-video">
                            <motion.img
                              src={imagePreview}
                              alt="Image Preview"
                              className="mt-2 rounded-md h-48 w-full object-cover transition-transform duration-200 transform hover:scale-105"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage("image")}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <AiOutlineClose className="w-4 h-4" />
                            </button>{" "}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium">
                          Video:
                        </label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileChange(e, "video")}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        {videoPreview && (
                          <div className="relative aspect-video">
                            <motion.video
                              src={videoPreview}
                              controls
                              className="mt-2 rounded-md h-48 w-full object-cover transition-transform duration-200 transform hover:scale-105"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage("video")}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <AiOutlineClose className="w-4 h-4" />
                            </button>{" "}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors disabled:opacity-50 flex items-center"
                      >
                        {isSubmitting && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        {currentService ? "Update Service" : "Create Service"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminService;
