import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Pagination from "../../../components/UI/Pagination";
import { useDispatch, useSelector } from "react-redux";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedContent, setExpandedContent] = useState({});
  const [imagePreview, setImagePreview] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "news/get-news" });
  }, []);

  const { news, loading } = useSelector((state) => state.newsData);
  useEffect(() => {
    setNewsList(news);
  }, [news]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    category: Yup.string().required("Category is required"),
    author: Yup.string().required("Author is required"),
    readTime: Yup.string().required("Read time is required"),
  });

  const handleImageChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    const existingPreviews = [...imagePreview];
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    const allPreviews = [...existingPreviews, ...newPreviews];

    setImagePreview(allPreviews);
    setFieldValue("picture", [...files]);
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    // Add text fields
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("category", values.category);
    formData.append("author", values.author);
    formData.append("readTime", values.readTime);

    // Add image files - use 'picture' to match backend expectation
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
    setShowForm(false);
    setIsEditing(null);
  };

  const toggleStatus = (id) => {
    setNewsList(
      newsList.map((news) =>
        news.id === id ? { ...news, status: !news.status } : news
      )
    );
  };

  const handleDelete = (id) => {
    dispatch({ type: "news/delete-news", payload: id });
    setNewsList(newsList.filter((news) => news.id !== id));
  };

  const handleEdit = (id) => {
    const newsToEdit = newsList.find((news) => news.id === id);
    setIsEditing(id);
    setShowForm(true);
  };

  const toggleContent = (id) => {
    setExpandedContent((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const NewsSkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-24 bg-gray-200 rounded mb-4"></div>
      <div className="h-48 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
  const images = [
    "https://picsum.photos/800/400",
    "https://picsum.photos/800/401",
    "https://picsum.photos/800/402",
  ];
  // Calculate the current items to display based on the current page
  const indexOfLastNews = currentPage * itemsPerPage;
  const indexOfFirstNews = indexOfLastNews - itemsPerPage;
  const currentNews = newsList.slice(indexOfFirstNews, indexOfLastNews);

  return (
    <div className="p-5 max-w-6xl mx-auto relative min-h-screen">
      <h1 className="text-3xl font-bold mb-8">News Management</h1>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {isEditing ? "Edit News" : "Create News"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
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
                picture: [],
                category: isEditing
                  ? newsList.find((news) => news.id === isEditing)?.category
                  : "",
                author: isEditing
                  ? newsList.find((news) => news.id === isEditing)?.author
                  : "",
                readTime: isEditing
                  ? newsList.find((news) => news.id === isEditing)?.readTime
                  : "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Title
                    </label>
                    <Field
                      name="title"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Content
                    </label>
                    <Field
                      as="textarea"
                      name="content"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                    />
                    <ErrorMessage
                      name="content"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {imagePreview.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {imagePreview.map((preview, index) => (
                          <div key={index} className="relative aspect-video">
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

                                // Get current picture values and remove the selected one
                                const currentPicture = values.picture || [];
                                const newFiles = Array.from(currentPicture);
                                newFiles.splice(index, 1);
                                setFieldValue("picture", newFiles);
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

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Category
                      </label>
                      <Field
                        name="category"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Author
                      </label>
                      <Field
                        name="author"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="author"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Read Time
                      </label>
                      <Field
                        name="readTime"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="readTime"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {isEditing ? "Update News" : "Add News"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800">News List</h2>

      {loading ? (
        <div className="space-y-6">
          <NewsSkeletonLoader />
          <NewsSkeletonLoader />
        </div>
      ) : currentNews.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-xl">No news articles available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentNews.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {news.title}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Teamwork IT Solution!</span>
                      <span>•</span>
                      <span>Technology</span>
                      <span>•</span>
                      <span>10 min</span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      news.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {news.status ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="relative">
                  {news.content ? (
                    <>
                      <p
                        className={`text-gray-600 text-lg leading-relaxed ${
                          !expandedContent[news.id] ? "line-clamp-3" : ""
                        }`}
                      >
                        {news.content}
                      </p>
                      {news.content.length > 150 && (
                        <button
                          onClick={() => toggleContent(news.id)}
                          className="text-blue-500 hover:text-blue-700 mt-2"
                        >
                          {expandedContent[news.id] ? "Show less" : "Read more"}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No content available</p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 mt-6">
                  {/* {images.map((image, index) => (
                    <div key={index} className="relative aspect-video">
                      <img
                        src={image}
                        alt={`News Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))} */}
                  {/* https://teamwork-backend-thlt.onrender.com/uploads/assets/picture-1751874395451.png */}
                  {news?.imageUrl && (
                    <img
                      src={news.imageUrl}
                      alt={`${news.title}`}
                      className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                    />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">{news.createdAt}</div>
                  <div className="space-x-2">
                    <button
                      onClick={() => toggleStatus(news.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      {news.status ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button
                      onClick={() => handleEdit(news.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(news.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(newsList.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
      >
        <AiOutlinePlus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default News;
