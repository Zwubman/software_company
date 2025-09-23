import React, { useState, useEffect } from "react";
import { useField, ErrorMessage } from "formik";

const DropdownWithTextInput = ({ label, options, ...props }) => {
  const [isOther, setIsOther] = useState(false);
  const [companyName, setCompanyName] = useState(props.companyName || "");
  const [field, meta] = useField(props);

  // Effect to set company name based on the selected value
  useEffect(() => {
    if (field.value === "others") {
      setIsOther(true);
    } else {
      setIsOther(false);
      setCompanyName(""); // Reset company name if not 'others'
    }
  }, [field.value]);

  const handleChange = (event) => {
    const value = event.target.value;
    field.onChange(event);
  };

  const handleCompanyNameChange = (event) => {
    setCompanyName(event.target.value);
    field.onChange({
      target: { name: "companyName", value: event.target.value },
    });
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          {...field}
          {...props}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#EB6407]"
        >
          <option value="">Select</option>
          {options.map((option, index) => (
            <option key={index} value={option.key}>
              {option.value}
            </option>
          ))}
        </select>
      </div>
      {isOther && (
        <div className="relative mt-2">
          <input
            type="text"
            value={companyName}
            onChange={handleCompanyNameChange}
            placeholder="Enter company name"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#EB6407]"
          />
        </div>
      )}
      <ErrorMessage
        name={field.name}
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </div>
  );
};

export default DropdownWithTextInput;
