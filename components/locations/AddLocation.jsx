"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AddLocation = () => {
  const [city, setCity] = useState("");
  const [pincodes, setPincodes] = useState([""]); 

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handlePincodeChange = (index, e) => {
    const newPincodes = [...pincodes];
    newPincodes[index] = e.target.value;
    setPincodes(newPincodes);
  };

  const addPincode = () => {
    setPincodes([...pincodes, ""]);
  };

  const removePincode = (index) => {
    const newPincodes = [...pincodes];
    newPincodes.splice(index, 1);
    setPincodes(newPincodes);
  };

  const handleSubmit = async () => {
    console.log(city);
    console.log(pincodes);

    const response = await axios.post("/api/location/add-location", {
      city,
      pincodes,
    });
    
    response.data.success ? toast.success(response.data.message) : toast.error(response.data.message)
    setCity("")
    setPincodes([""]);
  };

  return (
      <div className="w-1/3 shadow p-4 bg-white rounded-xl mx-2 flex flex-col justify-center items-center">
        <h1 className="text-2xl mb-2 text-center">Add New Location</h1>

        <p>Enter the name of the city you would like to add</p>

        {/* City input */}
        <div className="mb-4">
          <input
            type="text"
            className="py-2 rounded-md"
            value={city}
            placeholder="City Name"
            onChange={handleCityChange}
          />
        </div>

        {/* Pincode input */}
        <p>Enter the pincodes of the city to serve</p>
        <div className="flex flex-col justify-center">
          {pincodes.map((pincode, index) => (
            <div key={index} className="flex mb-2 justify-center">
              <input
                type="text"
                className="py-1 rounded-full text-sm w-1/2"
                value={pincode}
                onChange={(e) => handlePincodeChange(index, e)}
              />
              <button onClick={() => removePincode(index)}>
                <svg
                  className="w-5 h-5 text-red-500 dark:text-white mx-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={addPincode}
            className="px-5 py-1 text-sm bg-gray-700 text-white rounded-full w-fit mx-auto"
          >
            Add Another Pincode
          </button>
        </div>

        <div>
          <button
            onClick={handleSubmit}
            className="bg-orange-500 px-5 py-2 rounded-full text-white my-5"
          >
            Add Location
          </button>
        </div>
      </div>
  );
};

export default AddLocation;
