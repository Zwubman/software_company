import React, { useState } from 'react';

const ImageUpload = ({ setFieldValue, name }) => {
  const [imagePreview, setImagePreview] = useState([]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setImagePreview(prev => [...prev, ...newPreviews]);
    setFieldValue(name, files);
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreview];
    URL.revokeObjectURL(newPreviews[index]); // Clean up the URL
    newPreviews.splice(index, 1);
    setImagePreview(newPreviews);

    // Update the Formik field
    const newFiles = Array.from(setFieldValue(name));
    newFiles.splice(index, 1);
    setFieldValue(name, newFiles);
  };

  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
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
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;