import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { parsePhoneNumber } from "libphonenumber-js";
import "react-phone-input-2/lib/style.css";

const PhoneNumberInput = ({ onChange, value = "" }) => {
  const [phone, setPhone] = useState("251");
  const [isValid, setIsValid] = useState(true);
  const [country, setCountry] = useState(""); // Default country can be set here

  const handleChange = (value, countryData) => {
    setPhone(value);
    const fullNumber = `+${countryData.dialCode}${value.replace(/\s+/g, "")}`; // Remove spaces

    // Check if the phone number is valid
    try {
      const phoneNumber = parsePhoneNumber(fullNumber);
      const isUS = countryData.iso2 === "us"; // Check if the selected country is the US

      setIsValid(
        (phoneNumber.isValid() || isUS || value.length >= 12) &&
          value.length != 9
      );

      // Call the external onChange prop with the formatted phone number
      onChange(value); // Pass the full number to the parent component
    } catch (error) {
      setIsValid(false);
      onChange(""); // Reset phone number in case of invalid input
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col">
        <PhoneInput
          country={country}
          value={value || phone}
          onChange={handleChange}
          className="focus:bg-red-500"
          inputStyle={{
            width: "100%", // Use full width
            height: "50px", // Match height with other inputs
            fontSize: "1rem",
            color: "#374151", // Tailwind color
            backgroundColor: "#fff",
            border: "1px solid #E5E7EB", // Light gray border for consistency
            borderRadius: "0.375rem", // Tailwind rounded-md
            padding: "12px 15px 12px 40px ", // Consistent padding
            transition: "border-color 0.3s",
            // marginBottom: "10px",
          }}
          buttonStyle={{
            border: "1px solid #E5E7EB", // Match border with input
            fontSize: "1rem",
            height: "50px", // Match height with input
          }}
        />
        {/* Show error message only if the number is invalid */}
        {!isValid && phone && (
          <div className="text-red-600 mt-1 text-sm">
            Please enter a valid phone number.
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneNumberInput;
