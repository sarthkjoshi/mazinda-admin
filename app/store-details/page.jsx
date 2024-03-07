"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import OvalLoader from "@/components/utility/OvalLoader";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
const StoreDetails = () => {
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const response = await axios.post("/api/store/fetch-store-by-id", {
        id,
      });
      console.log(response.data.store);
      if (response.data.success) {
        setStoreData(response.data.store);
        setLoading(false);
      } else {
        console.error("Error while fetching the store");
      }
    } catch (error) {
      console.error("Error fetching store data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setSaveLoading(true);
    try {
      const response = await axios.put("/api/store/update-store", {
        storeData,
      });
      if (response.data.success) {
        toast.success(response.data.message, { autoClose: 3000 });
      } else {
        toast.error(response.data.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error saving product data: ", error);
    }
    setIsEditing(false);
    setSaveLoading(false);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Handle nested objects like pricing
    if (name.includes(".")) {
      const [fieldName, nestedField] = name.split(".");
      setStoreData({
        ...storeData,
        [fieldName]: {
          ...storeData[fieldName],
          [nestedField]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      // Update the storeData object with the edited value
      setStoreData({
        ...storeData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };
  const handleToggleDisableStore = async (id) => {
    try {
      const response = await axios.put("/api/store/toggledisablestore", {
        id,
      });

      if (response.data.success) {
        toast.success(response.data.message, { autoClose: 3000 });
      }
    } catch (err) {
      console.log("An error occurred: " + err.message);
    }
  };
  return (
    <div className="container mx-auto p-4 bg-white shadow-sm rounded-xl">
      <h1 className="text-3xl font-semibold mb-4">Store Details</h1>
      {loading ? (
        <OvalLoader />
      ) : (
        <>
          {isEditing ? (
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">
                    Approved Status:
                  </label>
                  <select
                    name="approvedStatus"
                    value={storeData.approvedStatus}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 ${
                      storeData.approvedStatus === "approved"
                        ? "bg-green-300"
                        : storeData.approvedStatus === "rejected"
                        ? "bg-red-300"
                        : "bg-yellow-300"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold">Store Name:</label>
                  <input
                    type="text"
                    name="storeName"
                    value={storeData.storeName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Owner Name:</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={storeData.ownerName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Mobile Number:</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={storeData.mobileNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold">
                    Alternate Mobile Number:
                  </label>
                  <input
                    type="tel"
                    name="alternateMobileNumber"
                    value={storeData.alternateMobileNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={storeData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Password</label>
                  <input
                    type="text"
                    name="password"
                    value={storeData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="flex justify-between">
              <div>
                <div>
                  <div>
                    {storeData.approvedStatus === "approved" ? (
                      <p className="text-lg my-2 bg-green-200 px-3 py-1 rounded-full w-fit text-green-800">
                        Approved
                      </p>
                    ) : storeData.approvedStatus === "rejected" ? (
                      <p className="text-lg my-2 bg-green-200 px-3 py-1 rounded-full w-fit text-green-800">
                        Rejected
                      </p>
                    ) : (
                      <p className="text-lg my-2 bg-yellow-200 px-3 py-1 rounded-full w-fit text-yellow-500">
                        Pending
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                      Store Name:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {storeData.storeName}
                    </p>
                  </div>

                  <div>
                    <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                      Owner Name:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {storeData.ownerName}
                    </p>
                  </div>
                  <div>
                    <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                      Mobile Number:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {storeData.mobileNumber}
                    </p>
                  </div>
                  <div>
                    <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                      Alternate Mobile Number:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {storeData.alternateMobileNumber}
                    </p>
                  </div>
                  <div>
                    <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                      Email:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {storeData.email}
                    </p>
                  </div>
                  <div>
                    <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                      Password:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {storeData.password}
                    </p>
                  </div>
                  <div>
                    <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                      Address:
                    </p>
                    <p className="inline-block mx-2 text-lg">
                      {storeData.storeAddress.address}
                      {", "}
                      {storeData.storeAddress.city}
                      {", "}
                      {storeData.storeAddress.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isEditing ? (
            <div className="flex">
              <button
                onClick={handleSaveClick}
                className={`${
                  !saveLoading ? "bg-[#fb691e]" : "bg-gray-300"
                } my-2 text-white px-4 py-2 rounded-md hover:opacity-70 focus:outline-none transition-all duration-300`}
              >
                {!saveLoading ? "Save" : "Saving..."}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="mx-3 border border-[#fb691e] my-2 text-[#fb691e] px-4 py-2 rounded-md hover:opacity-70 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditClick}
              className="bg-[#fb691e] my-5 text-white px-10 py-2 rounded-md hover:opacity-70 focus:outline-none"
            >
              Edit
            </button>
          )}
        </>
      )}
      <div className="flex items-center space-x-2">
        <Switch
          id="shop-disable"
          onClick={() => handleToggleDisableStore(id)}
        />
        <Label htmlFor="shop-disable">Store disable</Label>
      </div>
    </div>
  );
};

export default StoreDetails;
