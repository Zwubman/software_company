import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus } from "react-feather";
import { updateProfile } from "../../services/UserService"; // Ensure this service handles the update request
import toast from "react-hot-toast";
import { chageProfileFromStore } from "../../features/userSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.userData);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    user?.profilePicture || "../assets/teamwork.jpg"
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    region: user?.region || "unknown",
    zone: user?.zone || "unknown",
    experience: "5 Years",
    skills: "React, JavaScript, CSS",
    hobbies: "Coding, Reading, Traveling",
    education: "B.Sc. in Computer Science",
    languages: "English, Spanish",
  });
  const dispatch = useDispatch();
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Preview the selected image
        setImageFile(file); // Store the file directly
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // Append the other fields
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Append the image file if selected
    if (imageFile) {
      formDataToSend.append("profilePicture", imageFile, imageFile.name);
    }
    try {
      setLoading(true);
      const response = await updateProfile(formDataToSend);
      dispatch(chageProfileFromStore(response)); // Dispatch action here
      toast.success("profile updated");
    } catch (error) {
      toast.error("failed! Try again!");
    } finally {
      setLoading(false);
    }
  };
  const isEditing2 = false;
  return (
    <div className="bg-gray-100 py-8 mb-0">
      <div className="bg-white rounded-3xl px-10 py-4 w-full max-w-6xl border border-gray-200 mx-auto">
        <div className="flex flex-col items-center relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="profilePictureInput"
            disabled={!isEditing}
            // disabled
          />
          <label
            htmlFor="profilePictureInput"
            className="cursor-pointer relative"
          >
            <img
              src={imagePreview}
              alt="Profile"
              className="rounded-full w-20 h-20 md:w-40 md:h-40 mb-6 border-4 border-orange-500 shadow-md"
            />
            {isEditing && (
              <div className="absolute bottom-12 right-8 transform translate-x-1/2 translate-y-1/2 bg-orange-500 rounded-full p-1">
                <Plus className="w-6 h-6 text-white" />
              </div>
            )}
          </label>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {formData.name}
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-gray-700">
          {/* Profile fields */}
          {user.region && (<div className="flex  flex-col justify-between ">
            <span className="font-semibold text-gray-800">User Id:</span>
            {isEditing && isEditing2 ? (
              <input
                type="text"
                name="name"
                value={`#${user.id}`}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-2 py-1"
                disabled
              />
            ) : (
              <span>#{user.id}</span>
            )}
          </div>)}
          <div className="flex  flex-col justify-between ">
            <span className="font-semibold text-gray-800">Full Name:</span>
            {isEditing && isEditing2 ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-2 py-1"
                disabled
              />
            ) : (
              <span>{formData.name}</span>
            )}
          </div>
          <div className="flex flex-col justify-between ">
            <span className="font-semibold text-gray-800">Email:</span>
            {isEditing && isEditing2 ? (
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-2 py-1"
                disabled
              />
            ) : (
              <span>{formData.email}</span>
            )}
          </div>
          <div className="flex flex-col justify-between ">
            <span className="font-semibold text-gray-800">Phone:</span>
            {isEditing && isEditing2 ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled
                className="border border-gray-300 rounded-lg px-2 py-1"
              />
            ) : (
              <span>{formData.phone}</span>
            )}
          </div>

         
            <div className="flex  flex-col justify-between ">
              <span className="font-semibold text-gray-800">Role:</span>
              {isEditing && isEditing2 ? (
                <input
                  type="text"
                  name="education"
                  value={user.role}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-2 py-1"
                  disabled
                />
              ) : (
                <span>{user.role}</span>
              )}
            </div>

          {user.region && (
            <div className="flex flex-col justify-between ">
              <span className="font-semibold text-gray-800">Region:</span>
              {isEditing && isEditing2 ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.region}
                  onChange={handleChange}
                  disabled
                  className="border border-gray-300 rounded-lg px-2 py-1"
                />
              ) : (
                <span>{formData.region}</span>
              )}
            </div>
          )}
          {user.zone && (
            <div className="flex flex-col justify-between ">
              <span className="font-semibold text-gray-800">Zone:</span>
              {isEditing && isEditing2 ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.zone}
                  onChange={handleChange}
                  disabled
                  className="border border-gray-300 rounded-lg px-2 py-1"
                />
              ) : (
                <span>{formData.zone}</span>
              )}
            </div>
          )}
          {user.Woreda||user.woreda && (
            <div className="flex flex-col justify-between ">
              <span className="font-semibold text-gray-800">Woreda:</span>
              {isEditing && isEditing2 ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.woreda}
                  onChange={handleChange}
                  disabled
                  className="border border-gray-300 rounded-lg px-2 py-1"
                />
              ) : (
                <span>{user.Woreda||user.woreda}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => {
              if (isEditing) {
                handleSubmit(); // Call the submit function when saving
              }
              handleEditToggle(); // Toggle edit mode
            }}
            className="mt-4 p-2 min-w-24 rounded-lg bg-orange-500 text-white"
          >
            {loading ? "saving..." : isEditing ? "Save" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                handleEditToggle();
              }}
              className="mt-4 p-2 min-w-24 rounded-lg bg-white text-orange-500 border border-orange-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
