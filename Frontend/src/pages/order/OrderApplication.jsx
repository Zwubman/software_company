import React, { useState, useEffect } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import axios from "axios";
import { createOrder, updateOrder } from "../../services/OrderService";
import { api } from "../../constants/api";
import MyToast from "../../components/Notification/MyToast";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg flex items-center space-x-2 ${
      type === "error"
        ? "bg-red-100 text-red-800"
        : "bg-green-100 text-green-800"
    }`}
  >
    {type === "error" && <AlertCircle className="h-5 w-5" />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X className="h-4 w-4" />
    </button>
  </motion.div>
);

const OrderApplication = ({
  isOpen,
  onClose,
  onOrderAdded,
  serviceId,
  serviceName,
  orderData,
  user,
}) => {
  const [formData, setFormData] = useState({
    country: "",
    regionId: "",
    zoneId: "",
    woredaId: "",
    manualRegion: "",
    manualZone: "",
    manualWoreda: "",
    sector: "",
    orderTitle: serviceName || "",
    fullName: user?.name || "",
    sex: "male",
    roleInSector: "",
    phoneNumber1: user.phoneNumber || "",
    phoneNumber2: "",
    shortDescription: "",
    requirementFile: null, // Change to null to handle file uploads correctly
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isLoadingZones, setIsLoadingZones] = useState(false);
  const [isLoadingWoredas, setIsLoadingWoredas] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedZone, setSelectedZone] = useState("");

  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchRegions();

    if (orderData && Object.keys(orderData).length > 0) {
      setCurrentOrder(orderData);
      setFormData({
        country: orderData.country || "",
        regionId: orderData.regionId || "",
        zoneId: orderData.zoneId || "",
        woredaId: orderData.woredaId || "",
        fullName: user?.name || "",
        manualRegion: orderData.manualRegion || "",
        manualZone: orderData.manualZone || [],
        manualWoreda: orderData.manualWoreda || "",
        sector: orderData.sector || "",
        orderTitle: orderData.orderTitle?.toString() || "",
        sex: orderData.sex?.toString() || "",
        roleInSector: orderData.roleInSector || "",
        phoneNumber1: orderData.phoneNumber1?.toString() || "",
        phoneNumber2: orderData.phoneNumber2?.toString() || "",
        shortDescription: orderData.shortDescription?.toString() || "",
        requirementFile: orderData.requirementFile || "",
      });

      setSelectedRegion(orderData.regionId?.toString() || "");
      setSelectedZone(orderData.zoneId?.toString() || "");

      setFormErrors({});
    } else {
      // setToast({ message: "No agent request found", type: "info" });
    }
  }, [orderData]);

  const navigate = useNavigate();

  const fetchRegions = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setIsLoadingRegions(true);
      const response = await axios.get(`${api}/regions/all-region`, config);
      setRegions(response?.data?.regions?.regions || []);
      setIsLoadingRegions(false);
    } catch (error) {
      setIsLoadingRegions(false);

      setToast({ message: "Failed to fetch regions", type: "error" });
    }
  };

  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setSelectedZone("");
    setFormData({ ...formData, regionId, zoneId: "", woredaId: "" });
    setFormErrors({ ...formErrors, regionId: "", zoneId: "", woredaId: "" });
  };

  const handleZoneChange = (e) => {
    const zoneId = e.target.value;
    setSelectedZone(zoneId);
    setFormData({ ...formData, zoneId, woredaId: "" });
    setFormErrors({ ...formErrors, zoneId: "", woredaId: "" });
  };

  const zones = selectedRegion
    ? regions.find((r) => r.id === Number(selectedRegion))?.Zones || []
    : [];

  const woredas = selectedZone
    ? zones.find((z) => z.id === Number(selectedZone))?.woredas || []
    : selectedRegion
    ? regions
        .find((r) => r.id === Number(selectedRegion))
        ?.Zones.flatMap((z) => z.woredas) || []
    : regions.flatMap((r) => r.Zones.flatMap((z) => z.woredas));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.country) newErrors.country = "Country is required";

    if (formData.country === "Ethiopia") {
      if (!formData.regionId) newErrors.regionId = "Region is required";
      if (!formData.zoneId) newErrors.zoneId = "Zone is required";
      if (!formData.woredaId) newErrors.woredaId = "Woreda is required";
    } else {
      if (!formData.manualRegion)
        newErrors.manualRegion =
          "Manual region is required for non-Ethiopian customers";
      if (!formData.manualZone)
        newErrors.manualZone =
          "Manual zone is required for non-Ethiopian customers";
      if (!formData.manualWoreda)
        newErrors.manualWoreda =
          "Manual woreda/city is required for non-Ethiopian customers";
    }

    if (!formData.sector) newErrors.sector = "Sector is required";

    if (!formData.orderTitle) newErrors.orderTitle = "Order title is required";
    else if (formData.orderTitle.length < 3 || formData.orderTitle.length > 100)
      newErrors.orderTitle = "Order title must be between 3 and 100 characters";

    if (!formData.roleInSector)
      newErrors.roleInSector = "Role in sector is required";

    const phoneRegex = /^\+?[\d\s-]{10,}$/i;
    if (!formData.phoneNumber1)
      newErrors.phoneNumber1 = "Phone number is required";
    else if (!phoneRegex.test(formData.phoneNumber1))
      newErrors.phoneNumber1 = "Invalid phone number format";
    // if (!formData.phoneNumber2)
    //   newErrors.phoneNumber2 = "phone number 2 is required";
    // else if (formData.phoneNumber2 && !phoneRegex.test(formData.phoneNumber2))
    //   newErrors.phoneNumber2 = "Invalid phone number format";

    if (!formData.shortDescription)
      newErrors.shortDescription = "Description is required";
    else if (
      formData.shortDescription.length < 10 ||
      formData.shortDescription.length > 500
    )
      newErrors.shortDescription =
        "Description must be between 10 and 500 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //   const { isAuthenticated, user } = useSelector((state) => state.userData);

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0], // Store the selected file
      });
    } else {
      setFormData({
        ...formData,
        [name]: null, // Reset if no file is selected
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const orderData = new FormData(); // Create a FormData object
      orderData.append("country", formData.country);
      orderData.append(
        "regionId",
        formData.country === "Ethiopia" ? formData.regionId : null
      );
      orderData.append(
        "zoneId",
        formData.country === "Ethiopia" ? formData.zoneId : null
      );
      orderData.append(
        "woredaId",
        formData.country === "Ethiopia" ? formData.woredaId : null
      );
      orderData.append(
        "manualRegion",
        formData.country !== "Ethiopia" ? formData.manualRegion : null
      );
      orderData.append(
        "manualZone",
        formData.country !== "Ethiopia" ? formData.manualZone : null
      );
      orderData.append(
        "manualWoreda",
        formData.country !== "Ethiopia" ? formData.manualWoreda : null
      );
      orderData.append("sector", formData.sector);
      orderData.append("orderTitle", formData.orderTitle);
      orderData.append("fullName", formData.fullName);
      orderData.append("sex", formData.sex);
      orderData.append("roleInSector", formData.roleInSector);
      orderData.append("phoneNumber1", formData.phoneNumber1);
      orderData.append("phoneNumber2", formData.phoneNumber2 || null);
      orderData.append("shortDescription", formData.shortDescription);
      orderData.append("email", user.email);
      orderData.append("serviceId", serviceId);
      if (formData.requirementFile) {
        orderData.append("requirementFile", formData.requirementFile); // Append the file
      }
      if (currentOrder) {
        // Use a plain object for updateOrder

        // const updateData = {
        //   country: formData.country,
        //   regionId: formData.country === "Ethiopia" ? formData.regionId : null,
        //   zoneId: formData.country === "Ethiopia" ? formData.zoneId : null,
        //   woredaId: formData.country === "Ethiopia" ? formData.woredaId : null,
        //   manualRegion:
        //     formData.country !== "Ethiopia" ? formData.manualRegion : null,
        //   manualZone:
        //     formData.country !== "Ethiopia" ? formData.manualZone : null,
        //   manualWoreda:
        //     formData.country !== "Ethiopia" ? formData.manualWoreda : null,
        //   sector: formData.sector,
        //   orderTitle: formData.orderTitle,
        //   fullName: formData.fullName,
        //   sex: formData.sex,
        //   roleInSector: formData.roleInSector,
        //   phoneNumber1: formData.phoneNumber1,
        //   phoneNumber2: formData.phoneNumber2 || null,
        //   shortDescription: formData.shortDescription,
        //   email: user.email,
        //   serviceId: serviceId,
        // };

        await updateOrder(currentOrder.id, orderData); // Pass FormData to the updateOrder function
        MyToast("Order updated", "success");
        setToast({ message: "Order updated", type: "success" });
        onOrderAdded();
        // await updateOrder(currentOrder.id, updateData);
        // MyToast("order updated ", "success");
        // onOrderAdded()
      } else {
        await createOrder(orderData); // Pass FormData to the createOrder function
        // navigate('/my-orders')
        MyToast("order created ", "success");
        setToast({ message: "order created", type: "error" });
      }
      onClose();
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {currentOrder
              ? "Update Order "
              : "Add New Order for service number"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ maxHeight: "70vh" }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
              >
                <option value="">Select Country</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Other">Other</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>

            {formData.country === "Ethiopia" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Region
                  </label>
                  <select
                    name="regionId"
                    // value={formData.regionId}
                    // onChange={handleChange}
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                    disabled={isLoadingRegions}
                  >
                    <option value="">Select Region</option>
                    {regions?.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingRegions && (
                    <Loader2 className="h-4 w-4 text-[#EB6407] animate-spin mt-1" />
                  )}
                  {errors.regionId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.regionId}
                    </p>
                  )}
                  {errors.regions && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.regions}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zone
                  </label>
                  <select
                    name="zoneId"
                    // value={formData.zoneId}
                    // onChange={handleChange}
                    value={selectedZone}
                    onChange={handleZoneChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                    // disabled={!formData.regionId || isLoadingZones}
                    disabled={!selectedRegion}
                  >
                    <option value="">Select Zone</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingZones && (
                    <Loader2 className="h-4 w-4 text-[#EB6407] animate-spin mt-1" />
                  )}
                  {errors.zoneId && (
                    <p className="text-red-500 text-xs mt-1">{errors.zoneId}</p>
                  )}
                  {errors.zones && (
                    <p className="text-red-500 text-xs mt-1">{errors.zones}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Woreda
                  </label>
                  <select
                    name="woredaId"
                    value={formData.woredaId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                    disabled={!selectedZone}
                  >
                    <option value="">Select Woreda</option>
                    {woredas.map((woreda) => (
                      <option key={woreda.id} value={woreda.id}>
                        {woreda.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingWoredas && (
                    <Loader2 className="h-4 w-4 text-[#EB6407] animate-spin mt-1" />
                  )}
                  {errors.woredaId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.woredaId}
                    </p>
                  )}
                  {errors.woredas && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.woredas}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Manual Region
                  </label>
                  <input
                    type="text"
                    name="manualRegion"
                    value={formData.manualRegion}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  />
                  {errors.manualRegion && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.manualRegion}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Manual Zone
                  </label>
                  <input
                    type="text"
                    name="manualZone"
                    value={formData.manualZone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  />
                  {errors.manualZone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.manualZone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Manual Woreda/City
                  </label>
                  <input
                    type="text"
                    name="manualWoreda"
                    value={formData.manualWoreda}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  />
                  {errors.manualWoreda && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.manualWoreda}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sector
              </label>
              <input
                type="text"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
              />
              {errors.sector && (
                <p className="text-red-500 text-xs mt-1">{errors.sector}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order Title
              </label>
              <input
                type="text"
                name="orderTitle"
                value={formData.orderTitle}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
              />
              {errors.orderTitle && (
                <p className="text-red-500 text-xs mt-1">{errors.orderTitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={user.name}
                  onChange={handleChange}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sex
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role in Sector
              </label>
              <input
                type="text"
                name="roleInSector"
                value={formData.roleInSector}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
              />
              {errors.roleInSector && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.roleInSector}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number 1
                </label>
                <input
                  type="text"
                  name="phoneNumber1"
                  value={formData.phoneNumber1}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  placeholder="+251123456789"
                />
                {errors.phoneNumber1 && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber1}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number 2
                </label>
                <input
                  type="text"
                  name="phoneNumber2"
                  value={formData.phoneNumber2}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  placeholder="+251987654321"
                />
                {errors.phoneNumber2 && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber2}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                rows="3"
              />
              {errors.shortDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.shortDescription}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                File Upload (Optional)
              </label>
              <input
                type="file"
                name="requirementFile"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
              />
              {errors.requirementFile && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.requirementFile}
                </p>
              )}
            </div>
            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}
          </form>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-md border border-gray-300 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Submitting...
              </>
            ) : currentOrder ? (
              "Update "
            ) : (
              "submit"
            )}
          </button>
        </div>
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderApplication;
