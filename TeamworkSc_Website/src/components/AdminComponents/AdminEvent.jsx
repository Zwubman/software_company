import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  PenSquare,
  CalendarCheck,
  CalendarDays,
  Filter,
  X,
  Loader2,
  SquareChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import { AiOutlineCamera } from "react-icons/ai";
import EventDetail from "../../pages/Posts/Events/EventDetail";
import { getAllEventStat } from "../../services/Statistics";
const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

const AdminEvent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({});
  const [isDetailView, setIsDetailView] = useState(false);

  const [existingImages, setExistingImages] = useState([]); // URLs
  const [newImages, setNewImages] = useState([]); // File objects
  const [isEditing, setIsEditing] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
  });
  const { events, loading, totalEvents } = useSelector(
    (state) => state.eventData
  );
  const { user } = useSelector((state) => state.userData);

  const [eventsList, seteventsList] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [evetStat, setEventStat] = useState({});

  const handleConfirm = async () => {
    try {
      await dispatch({ type: "events/delete-events", payload: jobId });
      setDeleteDialogOpen(false);
    } catch (error) {
      setDeleteDialogOpen(false);
    }
  };

  const limit = 10;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "events/get-events",
      payload: { page: currentPage, limit, search: searchQuery, filters },
    });
  }, [currentPage, searchQuery, filters]);

  useEffect(() => {
    seteventsList(events);
    setTotalPages(Math.ceil(totalEvents / limit) || 1);
  }, [events]);

  useEffect(() => {
    getEventStat();
  }, [events]);
  const getEventStat = async () => {
    const response = await getAllEventStat();
    setEventStat(response.eventStat);
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string()
      .required("description is required")
      .min(50, "description must be at least 50 characters"),
    location: Yup.string().required("location is required"),
    eventDate: Yup.string()
      .required("Event Date is required")
      .test(
        "is-future-date",
        "Event date must be today or in the future",
        (value) => {
          if (isEditing) return true; // Skip validation if in editing mode
          if (!value) return false;
          const eventDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return eventDate >= today;
        }
      ),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("location", values.location);
    formData.append("eventDate", values.eventDate);
    // Append only string URLs as images
    existingImages.forEach((url) => {
      if (typeof url === "string") {
        formData.append("images", url);
        // console.log("Appending image URL:", url, "type:", typeof url);
      } else {
        // console.warn("Skipped non-string in existingImages:", url);
      }
    });
    // Append only File objects as pictures
    newImages.forEach((file) => {
      if (file instanceof File) {
        formData.append("pictures", file);
        // console.log("Appending picture file:", file.name, "type:", typeof file);
      } else {
        // console.warn("Skipped non-File in newImages:", file);
      }
    });

    // Debug log: print all FormData entries
    for (let pair of formData.entries()) {
      // console.log(pair[0] + ":", pair[1]);
    }

    if (isEditing) {
      await dispatch({
        type: "events/update-events",
        payload: formData,
        id: isEditing,
      });
    } else {
      await dispatch({ type: "events/create-events", payload: formData });
    }
    resetForm();
    setExistingImages([]);
    setNewImages([]);
    setIsModalOpen(false);
    setIsEditing(null);
  };


  const resetFormData = async () => {
    setData({});
    setIsModalOpen(false);
    setIsEditing(null);
    setExistingImages([]);
    setNewImages([]);
  };



  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDelete = async (id) => {
    setJobId(id);
    setDeleteDialogOpen(true);
  };

  const handleViewDetail = (events) => {
    setData(events);
    setIsDetailView(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // fetchevents();
    }
  };

  const handleEdit = (id) => {
    const eventToEdit = events.find((event) => event.id === id);
    if (eventToEdit) {
      const imageUrls = eventToEdit?.images?.map((img) => img.imageUrl) || [];
      console.log("Editing event:", eventToEdit);
      console.log("Initial images:", imageUrls);
      setExistingImages(imageUrls);
      setNewImages([]);
    }
    setIsEditing(id);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirm}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto "
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 ">
          events Management
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              icon: Newspaper,
              label: "Total events",
              value: evetStat.totalEvents || 0,
            },
            {
              icon: PenSquare,
              label: "Upcoming",
              value: evetStat.upcomingEvents || 0,
            },
            {
              icon: CalendarCheck,
              label: "Ongoing events",
              value: evetStat.ongoingEvents || 0,
            },
            {
              icon: CalendarDays,
              label: "completed events",
              value: evetStat.completedEvents || 0,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-4"
            >
              <stat.icon className="h-8 w-8 text-[#EB6407]" />
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        {isDetailView ? (
          <EventDetail
            event={data}
            onClose={() => setIsDetailView(!isDetailView)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main description */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search and Filter Bar */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <form
                  // onSubmit={handleSearchSubmit}
                  className="flex flex-col md:flex-row gap-4"
                >
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search events..."
                      className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                    />
                  </div>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="flex items-center px-4 py-2 border border-orange-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition duration-300"
                  >
                    <option value="">All</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                  {user?.role == "admin" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center justify-center px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      <span className="hidden md:inline">Create events</span>
                    </motion.button>
                  )}
                </form>
              </div>

              {/* events Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <div className=" overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3 text-left text-sm font-medium">
                              No.
                            </th>
                            <th className="p-3 text-left text-sm font-medium">
                              Title
                            </th>

                            <th className="p-3 text-left text-sm font-medium">
                              location{" "}
                            </th>

                            <th className="p-3 text-left text-sm font-medium hidden sm:table-cell">
                              Event date
                            </th>
                            <th className="p-3 text-center text-sm font-medium hidden sm:table-cell">
                              Status
                            </th>
                            <th className="p-3 text-center text-sm font-medium">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <AnimatePresence>
                            {Array.isArray(events) && events.length > 0 ? (
                              events.map((neww, index) =>
                                neww &&
                                typeof neww === "object" &&
                                neww.title ? (
                                  <motion.tr
                                    key={neww.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="p-3 text-sm text-gray-800">
                                      {index + 1}
                                    </td>
                                    <td className="p-3 text-sm text-gray-800">
                                      {neww.title && neww.title.length > 50
                                        ? `${neww.title.slice(0, 50)}...`
                                        : neww.title}
                                    </td>

                                    <td className="p-3 text-sm text-gray-600 capitalize">
                                      {neww.location}
                                    </td>

                                    <td className="p-3 text-sm text-gray-600 hidden sm:table-cell">
                                      {new Date(
                                        neww.eventDate
                                      ).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 text-sm hidden sm:table-cell">
                                      <span
                                        className={`font-semibold ${
                                          neww?.status === "completed"
                                            ? "text-green-600"
                                            : neww?.status === "upcoming"
                                            ? "text-blue-600"
                                            : neww?.status === "ongoing"
                                            ? "text-yellow-600"
                                            : "text-gray-600" // Default color
                                        }`}
                                      >
                                        {neww?.status || "upcoming"}
                                      </span>
                                    </td>

                                    <td className="p-3">
                                      <div className="flex space-x-4 justify-center">
                                        <button
                                          onClick={() => handleViewDetail(neww)}
                                          className="flex items-center border border-blue-500 text-blue-500 hover:bg-blue-100 transition-colors px-2 py-1 rounded-md text-xs"
                                          aria-label="View neww details"
                                        >
                                          <SquareChevronRight className="h-4 w-4 mr-1" />
                                          <span>Details</span>
                                        </button>

                                        {user?.role == "admin" && (
                                          <button
                                            onClick={() => handleEdit(neww.id)}
                                            className="flex items-center border border-gray-500 text-gray-500 hover:bg-gray-100 transition-colors px-2 py-1 rounded-md text-xs"
                                            aria-label="Edit neww"
                                          >
                                            <Edit className="h-4 w-4 mr-1" />
                                            <span>Edit</span>
                                          </button>
                                        )}
                                        {user?.role == "admin" && (
                                          <button
                                            onClick={() =>
                                              handleDelete(neww.id)
                                            }
                                            className="flex items-center border border-red-500 text-red-500 hover:bg-red-100 transition-colors px-2 py-1 rounded-md text-xs"
                                            aria-label="Delete neww"
                                          >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            <span>Delete</span>
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </motion.tr>
                                ) : null
                              )
                            ) : (
                              <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-32"
                              >
                                <td
                                  colSpan="8"
                                  className="text-center text-gray-500 p-4"
                                >
                                  No events found matching your criteria
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 space-y-2 sm:space-y-0">
                      <p className="text-sm text-gray-600">
                        Showing page {currentPage} of {totalPages} •{" "}
                        {eventsList?.length} newws
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 border rounded-md flex items-center ${
                            currentPage === 1
                              ? "text-gray-400 border-gray-200"
                              : "text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          <span>Previous</span>
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 border rounded-md flex items-center ${
                            currentPage === totalPages
                              ? "text-gray-400 border-gray-200"
                              : "text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <span>Next</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal for Create/Edit neww */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8 ">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl  p-6 w-full max-w-3xl mx-4 "
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {isEditing ? "Edit events" : "Create events"}
                  </h2>
                  <button
                    onClick={resetFormData}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <AiOutlineClose className="w-6 h-6" />
                  </button>
                </div>
                <Formik
                  initialValues={{
                    title: isEditing
                      ? eventsList.find((events) => events.id === isEditing)
                          ?.title || ""
                      : "",
                    description: isEditing
                      ? eventsList.find((events) => events.id === isEditing)
                          ?.description || ""
                      : "",
                    location: isEditing
                      ? eventsList.find((events) => events.id === isEditing)
                          ?.location || ""
                      : "",
                    eventDate: isEditing
                      ? new Date(
                          eventsList.find((events) => events.id === isEditing)
                            ?.eventDate || Date.now()
                        )
                          .toISOString()
                          .split("T")[0]
                      : "",
                  }}
                  validationSchema={validationSchema}
                  enableReinitialize
                  onSubmit={handleSubmit}
                >
                  {({ setFieldValue, values }) => (
                    <Form className="space-y-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Title
                        </label>
                        <Field
                          name="title"
                          // className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"

                          className="p-2 appearance-none border border-gray-300  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#EB6407]"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Images
                        </label>
                        <label className="flex items-center justify-center w-full h-12 px-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-[#EB6407] hover:bg-gray-50 transition-all">
                          <div className="flex items-center gap-2">
                            <AiOutlineCamera className="w-6 h-6 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              Add Images
                            </span>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        {/* Preview existing images (URLs) */}
                        {existingImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            {existingImages.map((url, index) => (
                              <div key={url} className="relative aspect-video">
                                <img
                                  src={url}
                                  alt={`Existing Preview ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveExistingImage(index)
                                  }
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <AiOutlineClose className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Preview new images (Files) */}
                        {newImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            {newImages.map((file, index) => (
                              <div
                                key={index}
                                className="relative aspect-video"
                              >
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`New Preview ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNewImage(index)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <AiOutlineClose className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 ">
                          description
                        </label>
                        <Field
                          as="textarea"
                          name="description"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#EB6407] h-32"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Location
                          </label>
                          <Field
                            name="location"
                            className="p-2 appearance-none border border-gray-300  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#EB6407]"
                          />
                          <ErrorMessage
                            name="location"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Event Date{" "}
                          </label>
                          <Field
                            name="eventDate"
                            type="date"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="eventDate"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:shadow-outline"
                      >
                        {isEditing ? "Update events" : "Add events"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminEvent;
