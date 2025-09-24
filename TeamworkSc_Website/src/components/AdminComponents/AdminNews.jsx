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
import DropdownWithTextInput from "../UI/DropdownWithTextInput";
import NewsDetail from "../detailPages/NewsDetail";

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

const AdminNews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({});
  const [isDetailView, setIsDetailView] = useState(false);

  const [imagePreview, setImagePreview] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    byDate: "",
    byCategory: "",
    byCompany: "",
  });
  const { news, loading, totalNews, todayNews, thisWeekNews, thisMonthNews } =
    useSelector((state) => state.newsData);
  const { user } = useSelector((state) => state.userData);

  const [newsList, setNewsList] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobId, setJobId] = useState(null);

  const handleConfirm = async () => {
    try {
      await dispatch({ type: "news/delete-news", payload: jobId });
      setDeleteDialogOpen(false);
    } catch (error) {
      setDeleteDialogOpen(false);
    }
  };

  const limit = 10;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "news/get-news",
      payload: { page: currentPage, limit, search: searchQuery, filters },
    });
  }, [currentPage, searchQuery, filters]);

  useEffect(() => {
    setNewsList(news);
    setTotalPages(Math.ceil(totalNews / limit) || 1);
  }, [news]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    content: Yup.string()
      .required("Content is required")
      .min(50, "Content must be at least 50 characters"),
    category: Yup.string().required("Category is required"),
    author: Yup.string().required("Author is required"),
    deadline: Yup.string()
      .required("Deadline Date is required")
      .test(
        "is-future-date",
        "Deadline date must be today or in the future",
        (value) => {
          if (!value) return false;
          if (isEditing) return true; // Skip validation if in editing mode
          const deadline = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return deadline >= today;
        }
      ),
    publishDate: Yup.string()
      .required("publish  Date is required")
      .test(
        "is-future-date",
        "publish date must be today or in the future",
        (value) => {
          if (isEditing) return true; // Skip validation if in editing mode
          if (!value) return false;
          const publishDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return publishDate >= today;
        }
      ),
  });
  //
  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    // Add text fields
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("category", values.category);
    formData.append("author", values.author);
    formData.append("deadline", values.deadline);
    formData.append("publishDate", values.publishDate);
    formData.append("companyName", values.companyName);

    // Add image files
    if (values.picture && Array.isArray(values.picture)) {
      values.picture.forEach((file) => {
        formData.append("picture", file);
      });
    }

    if (isEditing) {
      dispatch({
        type: "news/update-news",
        payload: {
          id: isEditing,
          formData: formData,
        },
      });
    } else {
      dispatch({ type: "news/create-news", payload: formData });
    }

    resetForm();
    setImagePreview([]);
    setIsModalOpen(false);
    setIsEditing(null);
  };
  const handleImageChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    const existingPreviews = [...imagePreview];
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    const allPreviews = [...existingPreviews, ...newPreviews];

    setImagePreview(allPreviews);
    setFieldValue("picture", [...files]);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const resetFilters = () => {
    setFilters({
      byDate: "",
      byCategory: "",
      byCompany: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const resetFormData = async () => {
    setData({});
    setIsModalOpen(false);
    setIsEditing(null);
    setImagePreview([]);
  };

  const handleDelete = async (id) => {
    setJobId(id);
    setDeleteDialogOpen(true);
  };

  const handleViewDetail = (news) => {
    setData(news);
    setIsDetailView(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // fetchnews();
    }
  };
  const handleEdit = (id) => {
    const newsToEdit = news.find((neww) => neww.id === id);
    if (newsToEdit) {
      const imageUrl = newsToEdit.imageUrl;

      setImagePreview([imageUrl]);
    }
    setIsEditing(id);
    setIsModalOpen(true);
  };

  const authorOptions = [
    { key: "teamwork", value: "Teamwork It Solution" },
    { key: "others", value: "others" },
  ];
  const categoryOptions = [
    { key: "technology", value: "Technology" },
    { key: "company-news", value: "Company News" },
  ];

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
          News Management
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Newspaper, label: "Total News", value: totalNews || 0 },
            { icon: PenSquare, label: "New Post's", value: todayNews || 0 },
            {
              icon: CalendarCheck,
              label: "This Week Post",
              value: thisWeekNews || 0,
            },
            {
              icon: CalendarDays,
              label: "This Month",
              value: thisMonthNews || 0,
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
          <NewsDetail news={data} onClose={() => setIsDetailView(false)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Content */}
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
                      placeholder="Search news..."
                      className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md transition-colors ${
                      showFilters
                        ? "bg-gray-100 border-gray-300"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Filter className="h-5 w-5 mr-2 text-gray-600" />
                    <span className="text-gray-700">Filters</span>
                  </button>
                  {user?.role == "admin" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center justify-center px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      <span className="hidden md:inline">Create News</span>
                    </motion.button>
                  )}
                </form>

                {/* Filter Panel */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date{" "}
                        </label>
                        <select
                          name="byDate"
                          value={filters.byDate}
                          onChange={handleFilterChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        >
                          <option value="">All Dates</option>
                          <option value="today">Today</option>
                          <option value="this-week">This Week</option>
                          <option value="this-month">This Month</option>
                          <option value="last-three-month">Last 3 Month</option>
                          <option value="last-six">Last 6 Month</option>
                          <option value="last-year">Last Year</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>

                        <select
                          name="byCategory"
                          value={filters.byCategory}
                          onChange={handleFilterChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        >
                          <option value="">All Categories</option>
                          <option value="technology">Technology</option>
                          <option value="company-news">Company News</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <select
                          name="byCompany"
                          value={filters.byCompany}
                          onChange={handleFilterChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        >
                          <option value="">All Company</option>
                          <option value="teamwork">Teamwork It Solution</option>
                          <option value="others">others</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reset All
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="  rounded-lg border border-gray-200">
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <div className=" overflow-x-scroll relative">
                      <table className="w-full  ">
                        <thead>
                          <tr className="bg-gray-100 text-gray-700">
                            <th className="p-1 text-left text-sm font-medium">
                              No.
                            </th>
                            <th className="p-2 text-left text-sm font-medium">
                              Title
                            </th>

                            <th className="p-3 text-left text-sm font-medium hidden xl:table-cell">
                              Category
                            </th>

                            <th className="p-3 text-left text-sm font-medium hidden xl:table-cell">
                              Author{" "}
                            </th>

                            <th className="p-3 text-left text-sm font-medium hidden xl:table-cell">
                              Created at{" "}
                            </th>

                            <th className="p-3 text-center text-sm font-medium">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <AnimatePresence>
                            {news?.length > 0 ? (
                              news.map((neww, index) => (
                                <motion.tr
                                  key={neww.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="p-1 text-sm text-gray-800">
                                    {index + 1}
                                  </td>
                                  <td className="p-2 text-sm text-gray-800 relative">
                                    {neww.title.length > 20
                                      ? `${neww.title.slice(0, 20)}...`
                                      : neww.title}
                                  </td>

                                  <td className="p-3 text-sm text-gray-600 hidden xl:table-cell">
                                    {neww.category}
                                  </td>

                                  <td className="p-3 text-sm text-gray-600 hidden xl:table-cell">
                                    {neww?.companyName
                                      ? neww.companyName
                                      : neww.author}
                                  </td>

                                  <td className="p-3 text-sm text-gray-600 hidden xl:table-cell">
                                    {new Date(
                                      neww.createdAt
                                    ).toLocaleDateString()}
                                  </td>

                                  <td className="p-3">
                                    <div className="flex space-x-2 justify-center">
                                      <button
                                        onClick={() => handleViewDetail(neww)}
                                        className="flex items-center border border-blue-600 text-blue-600 hover:bg-blue-100 transition-colors px-2 py-1 rounded-md text-xs"
                                        aria-label="View neww details"
                                      >
                                        <SquareChevronRight className="h-4 w-4 mr-1" />
                                        <span className="hidden lg:inline">
                                          View Details
                                        </span>
                                      </button>
                                      {user?.role == "admin" && (
                                        <button
                                          onClick={() => handleEdit(neww.id)}
                                          className="flex items-center border border-gray-600 text-gray-600 hover:bg-gray-100 transition-colors px-2 py-1 rounded-md text-xs"
                                          aria-label="Edit neww"
                                        >
                                          <Edit className="h-4 w-4 mr-1" />
                                          <span className="hidden lg:inline">
                                            Edit
                                          </span>
                                        </button>
                                      )}
                                      {user?.role == "admin" && (
                                        <button
                                          onClick={() => handleDelete(neww.id)}
                                          className="flex items-center border border-red-600 text-red-600 hover:bg-red-100 transition-colors px-2 py-1 rounded-md text-xs"
                                          aria-label="Delete neww"
                                        >
                                          <Trash2 className="h-4 w-4 mr-1" />
                                          <span className="hidden lg:inline">
                                            Delete
                                          </span>
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </motion.tr>
                              ))
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
                                  No newws found matching your criteria
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
                        {newsList?.length} newws
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-90vh overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {isEditing ? "Edit News" : "Create News"}
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
                      ? newsList.find((news) => news.id === isEditing)?.title
                      : "",
                    content: isEditing
                      ? newsList.find((news) => news.id === isEditing)?.content
                      : "",
                    images: [],
                    category: isEditing
                      ? newsList.find((news) => news.id === isEditing)?.category
                      : "",
                    author: isEditing
                      ? newsList.find((news) => news.id === isEditing)?.author
                      : "",
                    companyName:
                      isEditing &&
                      newsList.find((news) => news.id === isEditing)?.author ===
                        "others"
                        ? newsList.find((news) => news.id === isEditing)
                            ?.companyName || ""
                        : "",
                    deadline: isEditing
                      ? new Date(
                          newsList.find(
                            (news) => news.id === isEditing
                          )?.deadline
                        )
                          .toISOString()
                          .split("T")[0] || ""
                      : "",
                    publishDate: isEditing
                      ? new Date(
                          newsList.find(
                            (news) => news.id === isEditing
                          )?.publishDate
                        )
                          .toISOString()
                          .split("T")[0] || ""
                      : "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {(
                    { setFieldValue, values } // Destructure values here
                  ) => (
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
                        <label className="block text-gray-700 text-sm font-bold mb-2 ">
                          Content
                        </label>
                        <Field
                          as="textarea"
                          name="content"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#EB6407] h-32"
                        />
                        <ErrorMessage
                          name="content"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Image
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required={!isEditing}
                        />
                        {imagePreview?.length > 0 && (
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            {imagePreview.map((preview, index) => (
                              <div
                                key={index}
                                className="relative aspect-video"
                              >
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newPreviews = [...imagePreview];
                                    URL.revokeObjectURL(newPreviews[index]);
                                    newPreviews.splice(index, 1);
                                    setImagePreview(newPreviews);

                                    const newFiles = Array.from(values.images);
                                    newFiles.splice(index, 1);
                                    setFieldValue("images", newFiles);
                                  }}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <AiOutlineClose className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <DropdownWithTextInput
                          label="Select a category"
                          name="category"
                          options={categoryOptions}
                        />
                        <DropdownWithTextInput
                          label="Select Company"
                          name="author"
                          options={authorOptions}
                          companyName={values.companyName}
                        />

                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Deadline date
                          </label>
                          <Field
                            name="deadline"
                            type="date"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="deadline"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Publish date
                          </label>
                          <Field
                            name="publishDate"
                            type="date"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="publishDate"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:shadow-outline"
                      >
                        {isEditing ? "Update News" : "Add News"}
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

export default AdminNews;
