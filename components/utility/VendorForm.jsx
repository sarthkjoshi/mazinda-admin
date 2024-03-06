"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import OvalLoader from "./OvalLoader";

const VendorForm = () => {
  const [vendorData, setVendorData] = useState({
    name: "",
    number: "",
    alternateNumber: "",
    password: "",
    category: "",
    imageURI: "",
    deliveryLocations: [],
    deliveryCharges: {},
    minOrders: {},
    deliveryRequirements: {},
    payPercentage: "", // Added payPercentage field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData({
      ...vendorData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    let newLocations = [...vendorData.deliveryLocations];
    let newDeliveryCharges = { ...vendorData.deliveryCharges };
    let newMinOrders = { ...vendorData.minOrders };

    if (checked) {
      newLocations.push(name);
      if (!newDeliveryCharges.hasOwnProperty(name)) {
        newDeliveryCharges[name] = "";
      }
      if (!newMinOrders.hasOwnProperty(name)) {
        newMinOrders[name] = "";
      }
    } else {
      newLocations = newLocations.filter((location) => location !== name);
      delete newDeliveryCharges[name];
      delete newMinOrders[name];
    }

    setVendorData({
      ...vendorData,
      deliveryLocations: newLocations,
      deliveryCharges: newDeliveryCharges,
      minOrders: newMinOrders,
    });
  };

  const handleDeliveryRequirementChange = (
    location,
    charge,
    minOrder,
    maxOrder
  ) => {
    setVendorData((prevData) => ({
      ...prevData,
      deliveryRequirements: {
        ...prevData.deliveryRequirements,
        [location]: {
          charge,
          minOrder,
          maxOrder,
        },
      },
    }));
  };

  const handleDeliveryChargeChange = (location, value) => {
    setVendorData((prevData) => ({
      ...prevData,
      deliveryCharges: {
        ...prevData.deliveryCharges,
        [location]: value,
      },
    }));
  };

  const handleMinOrderChange = (location, value) => {
    setVendorData((prevData) => ({
      ...prevData,
      minOrders: {
        ...prevData.minOrders,
        [location]: value,
      },
    }));
  };

  const deliveryLocations = [
    { key: "North", label: "North Campus" },
    { key: "South", label: "South Campus" },
    { key: "Catalyst", label: "Catalyst (New Building)" },
    { key: "Garpa", label: "Garpa" },
    { key: "Mind Tree", label: "Mind Tree" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let updatedDeliveryLocations = Array.from(
      new Set(
        vendorData.deliveryLocations.map((location) =>
          location.endsWith("External")
            ? location.replace("External", "")
            : location
        )
      )
    );

    let updatedDeliveryCharges = {};
    for (const key in vendorData.deliveryCharges) {
      if (key.endsWith("External")) {
        continue;
      }
      updatedDeliveryCharges[key] = vendorData.deliveryCharges[key];
    }

    let updatedMinOrders = {};
    for (const key in vendorData.minOrders) {
      if (key.endsWith("External")) {
        continue;
      }
      updatedMinOrders[key] = vendorData.minOrders[key];
    }

    setVendorData((prevData) => ({
      ...prevData,
      deliveryLocations: updatedDeliveryLocations,
      deliveryCharges: updatedDeliveryCharges,
      minOrders: updatedMinOrders,
    }));

    const response = await axios.post("/api/food/vendor/add", {
      vendorData: {
        ...vendorData,
        deliveryLocations: updatedDeliveryLocations,
        deliveryCharges: updatedDeliveryCharges,
        minOrders: updatedMinOrders,
      },
    });
    const json = await response.data;
    setIsSubmitting(false);

    if (json.success) {
      toast.success(json.message, { autoClose: 3000 });
    } else {
      toast.error(json.message, { autoClose: 3000 });
    }
  };

  return (
    <>
      <div className="p-4 md:w-1/3 bg-white mt-4">
        <h2 className="text-2xl font-semibold mb-4">Add Vendor</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={vendorData.name}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Number:
            </label>
            <input
              type="text"
              name="number"
              value={vendorData.number}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Alternate Number:
            </label>
            <input
              type="text"
              name="alternateNumber"
              value={vendorData.alternateNumber}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={vendorData.password}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category:
            </label>
            <input
              type="text"
              name="category"
              value={vendorData.category}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Image URI:
            </label>
            <input
              type="text"
              name="imageURI"
              value={vendorData.imageURI}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Can Deliver To:
            </label>
            {deliveryLocations.map((location) => (
              <div key={location.key}>
                <label>
                  {location.label}
                  <input
                    type="checkbox"
                    name={location.key}
                    checked={vendorData.deliveryLocations.includes(
                      location.key
                    )}
                    onChange={handleCheckboxChange}
                    className="ml-2"
                  />
                  {vendorData.deliveryLocations.includes(location.key) && (
                    <>
                      <input
                        type="text"
                        placeholder={`Delivery Charge for ${location.label}`}
                        name={`${location.key}Charge`}
                        value={vendorData.deliveryCharges[location.key] || ""}
                        onChange={(e) =>
                          handleDeliveryChargeChange(
                            location.key,
                            e.target.value
                          )
                        }
                        className="mt-1 p-2 border rounded-md w-full"
                      />
                      <input
                        type="text"
                        placeholder={`Min Order Value for ${location.label}`}
                        name={`${location.key}MinOrder`}
                        value={vendorData.minOrders[location.key] || ""}
                        onChange={(e) =>
                          handleMinOrderChange(location.key, e.target.value)
                        }
                        className="mt-1 p-2 border rounded-md w-full"
                      />
                    </>
                  )}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              External Delivery Requirements:
            </label>
            {deliveryLocations.map((location) => (
              <div key={location.key}>
                <label>
                  {location.label}
                  <input
                    type="checkbox"
                    name={location.key + "External"}
                    checked={vendorData.deliveryLocations.includes(
                      location.key + "External"
                    )}
                    onChange={handleCheckboxChange}
                    className="ml-2"
                  />
                  {vendorData.deliveryLocations.includes(
                    location.key + "External"
                  ) && (
                    <>
                      <input
                        type="text"
                        placeholder={`External Delivery Charge for ${location.label}`}
                        name={`${location.key}ExternalCharge`}
                        value={
                          vendorData.deliveryRequirements[location.key]
                            ?.charge || ""
                        }
                        onChange={(e) =>
                          handleDeliveryRequirementChange(
                            location.key,
                            e.target.value,
                            vendorData.deliveryRequirements[location.key]
                              ?.minOrder || "",
                            vendorData.deliveryRequirements[location.key]
                              ?.maxOrder || ""
                          )
                        }
                        className="mt-1 p-2 border rounded-md w-full"
                      />
                      <input
                        type="text"
                        placeholder={`Min Order Value for External Delivery to ${location.label}`}
                        name={`${location.key}ExternalMinOrder`}
                        value={
                          vendorData.deliveryRequirements[location.key]
                            ?.minOrder || ""
                        }
                        onChange={(e) =>
                          handleDeliveryRequirementChange(
                            location.key,
                            vendorData.deliveryRequirements[location.key]
                              ?.charge || "",
                            e.target.value,
                            vendorData.deliveryRequirements[location.key]
                              ?.maxOrder || ""
                          )
                        }
                        className="mt-1 p-2 border rounded-md w-full"
                      />
                      <input
                        type="text"
                        placeholder={`Max Order Value for External Delivery to ${location.label}`}
                        name={`${location.key}ExternalMaxOrder`}
                        value={
                          vendorData.deliveryRequirements[location.key]
                            ?.maxOrder || ""
                        }
                        onChange={(e) =>
                          handleDeliveryRequirementChange(
                            location.key,
                            vendorData.deliveryRequirements[location.key]
                              ?.charge || "",
                            vendorData.deliveryRequirements[location.key]
                              ?.minOrder || "",
                            e.target.value
                          )
                        }
                        className="mt-1 p-2 border rounded-md w-full"
                      />
                    </>
                  )}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Pay Percentage:
            </label>
            <input
              type="text"
              name="payPercentage"
              value={vendorData.payPercentage}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? <OvalLoader /> : "Add Vendor"}
          </button>
        </form>
      </div>
    </>
  );
};

export default VendorForm;
