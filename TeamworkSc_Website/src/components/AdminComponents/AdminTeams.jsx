import { Loader2, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import { useSelector } from "react-redux";
import { fillOffset, motion } from "framer-motion";
import {
  createTeamEntry,
  deleteTeamEntry,
  getTeamEntries,
  updateTeamEntry,
} from "../../services/TeamService";
import TeamSkeleton from "../../pages/Posts/More/Team/TeamSkeleton";
import MyToast from "../../components/Notification/MyToast";

const AdminTeams = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(6);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState({});
  const filteredMembers = teamMembers.filter((member) =>
    member.fullName.toLowerCase().includes(search.toLowerCase())
  );
  const { user } = useSelector((state) => state.userData);

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const currentMembers = filteredMembers.slice(
    startIndex,
    startIndex + membersPerPage
  );

  useEffect(() => {
    getAllTeamMembers();
  }, []);

  const getAllTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await getTeamEntries();
      setTeamMembers(response?.team?.services || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading1(id);
    try {
      await deleteTeamEntry(id);
      setTeamMembers((prev) => prev.filter((member) => member.id !== id));
    } catch (error) {
      MyToast(error?.message || "Failed to delete team member", "error");
    } finally {
      setLoading1(false);
    }
  };

  const handleAddOrUpdate = (newMember) => {
    if (editingMember) {
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === editingMember.id ? newMember : member
        )
      );
    } else {
      setTeamMembers([...teamMembers, newMember]);
    }
    setModalOpen(false);
    setEditingMember(null); // Reset editing member
  };

  const closeDialog = () => {
    setModalOpen(false);
    setEditingMember(null); // Reset editing member
  };

  return (
    <div className="my-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Our Team Members</h1>
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-8">
        <form className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search} // Bind the search state to the input
              onChange={(e) => setSearch(e.target.value)} // Update the search state on input change
              placeholder="Search team members..."
              className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
            />
          </div>

          {user?.role === "admin" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">Add Member</span>
            </motion.button>
          )}
        </form>
      </div>
      {loading ? (
        <TeamSkeleton />
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {currentMembers.map((member) => (
            <div
              key={member.id}
              className="relative bg-white border border-gray-100 rounded-3xl p-6 pt-10 shadow-md hover:shadow-xl transition duration-300 text-center"
            >
              <div className="w-24 h-24 mx-auto -mt-16 rounded-full overflow-hidden shadow-lg border-4 border-white">
                <img
                  src={member.imageUrl}
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#3a4253]">
                {member.fullName}
              </h3>
              <p className="text-sm text-[#EB6407] font-medium mb-4">
                {member.title}
              </p>
              <p className="text-sm text-gray-600 italic leading-relaxed">
                {member.quote}
              </p>
              <div className="mt-4 flex justify-evenly">
                {loading1 === member.id ? (
                  <button
                    className="mt-2 p-2 px-4 bg-[#EB6407]  rounded flex items-center text-white gap-2"
                    disabled
                  >
                    Deleting{" "}
                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                  </button>
                ) : (
                  <button
                    className="mt-2 p-2 px-4 bg-[#EB6407] text-white rounded"
                    onClick={() => handleDelete(member.id)}
                  >
                    Delete
                  </button>
                )}

                <button
                  className="mt-2 ml-2 py-2 px-6 bg-[#19274a] text-white rounded"
                  onClick={() => {
                    setEditingMember(member);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-4 mx-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {modalOpen && (
        <Modal
          member={editingMember}
          onClose={closeDialog}
          onSave={handleAddOrUpdate}
        />
      )}
    </div>
  );
};

const Modal = ({ member, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: member?.fullName || "",
    title: member?.title || "",
    imageUrl: member?.imageUrl || "",
    quote: member?.quote || "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(member?.imageUrl || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imageUrl: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("title", formData.title);
    data.append("quote", formData.quote);
    if (formData.imageUrl) data.append("imageUrl", formData.imageUrl);
    setLoading(true);
    try {
      if (member) {
        const response = await updateTeamEntry(member.id, data);
        MyToast(response?.message || "Member Updated successfully!", "success");
        onSave(response?.data);
      } else {
        const response = await createTeamEntry(data);
        MyToast(response?.message || "Member Added Successfully!", "success");
        onSave(response?.team);
      }
      onClose(); // Close dialog after saving
    } catch (error) {
      MyToast(error?.message || "Failed to save team member", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <form onSubmit={handleCreateOrUpdate}>
          <div className="md:col-span-2 flex flex-col items-center mb-4">
            <div className="relative w-32 h-32 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required={!imagePreview} // Only require if no image preview
              />
              <div
                className={`flex items-center justify-center w-full h-full rounded-full border border-gray-300`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 mb-2 mr-2">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white bg-orange-600 rounded-full p-2 hover:bg-orange-700 transition duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                          required={!imagePreview} // Only require if no image preview
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                )}
              </div>
            </div>
            <label className="block text-sm font-medium text-[#3a4253] mb-1">
              Picture of the Member
            </label>
          </div>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="mb-2 p-2 border border-gray-300 rounded w-full"
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="mb-2 p-2 border border-gray-300 rounded w-full"
            required
          />
          <textarea
            name="quote"
            placeholder="Quote"
            value={formData.quote}
            onChange={handleChange}
            className="mb-2 p-2 border border-gray-300 rounded w-full"
            required
          />
          <div className="flex justify-evenly mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-[#EB6407] text-white px-4 py-2 rounded"
            >
              Cancel
            </button>

            {loading ? (
              <button
                className="mt-2 p-2 px-4 bg-[#19274a]  rounded flex items-center text-white gap-2"
                disabled
              >
                Saving <Loader2 className="animate-spin h-5 w-5 text-white" />
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#19274a] text-white px-6 py-2 rounded"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTeams;
