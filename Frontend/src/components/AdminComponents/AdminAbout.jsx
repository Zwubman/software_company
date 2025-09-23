import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Info, Loader2 } from "lucide-react";
import {
  createAboutEntry,
  getAboutEntries,
  updateAboutEntry,
  deleteAboutEntry,
} from "../../services/AboutService";
import { useSelector } from "react-redux";
// Loader component
const Loader = () => (
  <div className="space-y-4">
    {Array.from({ length: 1 }).map((_, index) => (
      <div
        key={index}
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-md flex animate-pulse"
      >
        <div className="flex-1">
          <div className="h-8 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded mb-2 w-5/6"></div>
          <div className="mb-2">
            <strong className="text-[#EB6407]"></strong>
            <div className="h-6 bg-gray-300 rounded mb-1 w-1/2"></div>
          </div>
          <div className="mb-2">
            <strong className="text-[#EB6407]"></strong>
            <div className="h-6 bg-gray-300 rounded mb-1 w-1/2"></div>
          </div>
          <div className="mb-2">
            <strong className="text-[#EB6407]"></strong>
            <ul className="list-disc pl-5">
              <li className="h-6 bg-gray-300 rounded mb-1 w-4/5"></li>
              <li className="h-6 bg-gray-300 rounded mb-1 w-4/5"></li>
            </ul>
          </div>
          <div className="flex space-x-2 mt-4">
            <div className="h-12 bg-gray-300 rounded w-24"></div>
            <div className="h-12 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
        <div className="h-auto w-1/3 bg-gray-300 rounded ml-4"></div>
      </div>
    ))}
  </div>
);

const AdminAbout = () => {
  const [aboutData, setAboutData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    aboutImage: "",
    content: "",
    mission: "",
    vision: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);

  const [values, setValues] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.userData);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    setIsLoading(true);
    try {
      const response = await getAboutEntries();
      if (response && response.success) {
        setAboutData(response.statistics.abouts);
      } else {
        console.error("Failed to fetch about entries");
      }
    } catch (error) {
      console.error("Error fetching about entries:", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const formDataToSend = new FormData();

    // Append form data
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("mission", formData.mission);
    formDataToSend.append("vision", formData.vision);
    if (imageFile) {
      formDataToSend.append("aboutImage", imageFile, imageFile.name);
    }

    // Ensure values is an array of objects
    const valuesArray = values
      .map((value) => ({
        title: value.title || "",
        description: value.description || "",
      }))
      .filter((value) => value.title && value.description);

    // Only append values if it's a valid array
    if (valuesArray.length > 0) {
      formDataToSend.append("values", JSON.stringify(valuesArray));
    } else {
      console.error("Values array must be non-empty and structured correctly");
      setIsLoading(false);
      return; // Early exit if values are invalid
    }

    try {
      if (currentIndex !== null) {
        const aboutId = aboutData[currentIndex].id;
        await updateAboutEntry(aboutId, formDataToSend);
      } else {
        await createAboutEntry(formDataToSend);
      }
      await fetchAbout();
      resetForm();
    } catch (error) {
      console.error("Error saving about entry:", error);
    }
    setIsLoading(false);
  };

  const handleEdit = (index) => {
    setCurrentIndex(index);
    const currentData = aboutData[index];
    setFormData({
      title: currentData.title,
      content: currentData.content,
      mission: currentData.mission,
      vision: currentData.vision,
    });
    setImagePreview(currentData.aboutImage);

    // Ensure values is properly formatted and contains valid objects
    const validValues =
      currentData.values && Array.isArray(currentData.values)
        ? currentData.values
            .filter((value) => value && typeof value === "object")
            .map((value) => ({
              title: value.title || "",
              description: value.description || "",
            }))
        : [];

    setValues(
      validValues.length > 0 ? validValues : [{ title: "", description: "" }]
    );
    setIsModalOpen(true);
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setIsLoading(true);
      try {
        const aboutId = aboutData[index].id;
        await deleteAboutEntry(aboutId);
        await fetchAbout();
      } catch (error) {
        console.error("Error deleting about entry:", error);
      }
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      aboutImage: "",
      content: "",
      mission: "",
      vision: "",
    });
    setImagePreview("");
    setCurrentIndex(null);
    setValues([]);
    setImageFile(null);
  };

  const addCoreValue = () => {
    setValues((prev) => [...prev, { title: "", description: "" }]);
  };

  const handleCoreValueChange = (index, e) => {
    const { name, value } = e.target;
    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], [name]: value };
      return newValues;
    });
  };

  const removeCoreValue = (index) => {
    setValues((prevValues) => prevValues.filter((_, i) => i !== index));
  };

  // if (isLoading) {
  //   return <Loader />;
  // }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            About Management
          </h1>

          {user?.role == "admin" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mb-4 flex items-center px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" /> Add New About
            </button>
          )}
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {aboutData.length === 0 ? (
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md mb-4 flex items-center">
                  <Info className="h-6 w-6 text-gray-500 mr-2" />
                  <p className="text-gray-600">No About entries found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aboutData.map((data, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-md flex flex-col md:flex-row"
                    >
                      {data.aboutImage && (
                        <img
                          src={data.aboutImage}
                          alt="About"
                          className="w-full md:w-1/3 h-auto rounded mb-4 md:mb-0 md:ml-0 md:mr-4 order-first md:order-last"
                        />
                      )}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold mb-2">
                          {data.title}
                        </h2>
                        <p className="mb-2">{data.content}</p>
                        <div className="mb-2">
                          <strong className="text-[#EB6407]">mission:</strong>
                          <p>{data.mission}</p>
                        </div>
                        <div className="mb-2">
                          <strong className="text-[#EB6407]">vision:</strong>
                          <p>{data.vision}</p>
                        </div>
                        <div className="mb-2">
                          <strong className="text-[#EB6407]">Values:</strong>
                          <ul className="list-disc pl-5">
                            {Array.isArray(data.values) &&
                              data.values.map((value, i) => (
                                <li key={i} className="text-gray-700">
                                  <strong>{value.title}:</strong>{" "}
                                  {value.description}
                                </li>
                              ))}
                          </ul>
                        </div>
                        {user?.role == "admin" && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            <button
                              onClick={() => handleEdit(index)}
                              className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-900"
                            >
                              <Edit className="h-5 w-5 mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(index)}
                              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              <Trash2 className="h-5 w-5 mr-1" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {currentIndex !== null ? "Edit About" : "Create New About"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    title
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-md"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-full h-auto rounded"
                    />
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    mission
                  </label>
                  <textarea
                    name="mission"
                    value={formData.mission}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    vision
                  </label>
                  <textarea
                    name="vision"
                    value={formData.vision}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Core Values
                  </label>
                  {values.map((value, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        name="title"
                        placeholder="title"
                        value={value.title}
                        onChange={(e) => handleCoreValueChange(index, e)}
                        className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407] mr-2"
                        required
                      />
                      <input
                        type="text"
                        name="description"
                        placeholder="description"
                        value={value.description}
                        onChange={(e) => handleCoreValueChange(index, e)}
                        className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407] mr-2"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeCoreValue(index)}
                        className="bg-red-600 text-white rounded-md px-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCoreValue}
                    className="mt-2 px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600]"
                  >
                    Add Core Value
                  </button>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : currentIndex !== null ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAbout;
