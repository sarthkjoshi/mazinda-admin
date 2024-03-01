"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import OvalLoader from "./OvalLoader";

const VendorDetailsPage = () => {
  const [vendorData, setVendorData] = useState([]);
  const [openVendorId, setOpenVendorId] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [editedData, setEditedData] = useState({});
  const [editedDeliveryCharges, setEditedDeliveryCharges] = useState({});
  const [editedMinOrders, setEditedMinOrders] = useState({});
  const [newLocation, setNewLocation] = useState("");

  // Function to toggle the dropdown for each vendor
  const toggleDropdown = (vendorId) => {
    setOpenVendorId(openVendorId === vendorId ? null : vendorId);
  };

  // Function to parse date into a readable format
  const parseDate = (date) => {
    const d = new Date(date);
    return d.toString();
  };

  // Function to handle clicking the "Edit" button
  const handleEditClick = (vendorId) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [vendorId]: true,
    }));
    // Clone the vendor data for editing
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [vendorId]: {
        ...vendorData.vendors.find((vendor) => vendor._id === vendorId),
      },
    }));
    // Initialize the editedDeliveryCharges and editedMinOrders state
    setEditedDeliveryCharges((prevCharges) => ({
      ...prevCharges,
      [vendorId]: {
        ...vendorData.vendors.find((vendor) => vendor._id === vendorId)
          .deliveryCharges,
      },
    }));
    setEditedMinOrders((prevOrders) => ({
      ...prevOrders,
      [vendorId]: {
        ...vendorData.vendors.find((vendor) => vendor._id === vendorId)
          .minOrders,
      },
    }));
  };

  // Function to handle input changes in the edit mode
  const handleInputChange = (vendorId, fieldName, value) => {
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [vendorId]: {
        ...prevEditedData[vendorId],
        [fieldName]: value,
      },
    }));
  };

  // Function to handle delivery charge changes in edit mode
  const handleDeliveryChargeChange = (vendorId, location, value) => {
    setEditedDeliveryCharges((prevCharges) => ({
      ...prevCharges,
      [vendorId]: {
        ...prevCharges[vendorId],
        [location]: value,
      },
    }));
  };

  // Function to handle minimum order value changes in edit mode
  const handleMinOrderChange = (vendorId, location, value) => {
    setEditedMinOrders((prevOrders) => ({
      ...prevOrders,
      [vendorId]: {
        ...prevOrders[vendorId],
        [location]: value,
      },
    }));
  };

  // Function to handle clicking the "Save" button
  const handleSaveClick = async (vendorId) => {
    // Save the edited data
    const updatedVendor = editedData[vendorId];
    const updatedDeliveryCharges = editedDeliveryCharges[vendorId];
    const updatedMinOrders = editedMinOrders[vendorId];
    updatedVendor.deliveryCharges = updatedDeliveryCharges;
    updatedVendor.minOrders = updatedMinOrders;

    // Update the state
    setVendorData((prevData) => ({
      ...prevData,
      vendors: prevData.vendors.map((vendor) =>
        vendor._id === vendorId ? updatedVendor : vendor
      ),
    }));
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [vendorId]: false,
    }));

    // Make an API call to update the vendor data
    const { data } = await axios.post("/api/vendorDetails", {
      updatedVendor,
    });
    toast.success(data.message);
  };

  // Function to handle adding a new delivery location
  const handleAddLocation = (vendorId, newLocation) => {
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [vendorId]: {
        ...prevEditedData[vendorId],
        deliveryLocations: [
          ...prevEditedData[vendorId].deliveryLocations,
          newLocation,
        ],
      },
    }));
    setNewLocation("");
  };

  // Function to handle removing a delivery location
  const handleRemoveLocation = (vendorId, indexToRemove) => {
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [vendorId]: {
        ...prevEditedData[vendorId],
        deliveryLocations: prevEditedData[vendorId].deliveryLocations.filter(
          (_, index) => index !== indexToRemove
        ),
      },
    }));
  };

  // Use useEffect to fetch initial vendor data
  useEffect(() => {
    setFetchingData(true);
    const fetchVendors = async () => {
      const { data } = await axios.get("/api/vendorDetails");
      setVendorData(data);
      setFetchingData(false);
    };
    fetchVendors();
  }, []);

  return (
    <div className="container mx-auto p-4 md:w-1/3">
      <h1 className="text-2xl font-semibold mb-5 text-center">
        Vendor Details
      </h1>
      {fetchingData ? (
        <OvalLoader />
      ) : (
        <Accordion type="single" collapsible>
          {vendorData.vendors.map((vendor) => (
            <AccordionItem value={vendor._id} key={vendor._id}>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setOpenVendorId(
                      openVendorId === vendor._id ? null : vendor._id
                    );
                  }}
                >
                  <AccordionTrigger>{vendor.name}</AccordionTrigger>
                </button>

                <div className="flex items-center gap-2">
                  <Badge
                    onClick={() => handleToggle(vendor.number)}
                    className="bg-green-500 cursor-pointer hover:bg-green-600 p-2"
                  >
                    {"Toggle"}
                  </Badge>
                  {editMode[vendor._id] ? (
                    <div className="flex gap-2">
                      <Button
                        className="bg-green-500 px-4"
                        onClick={() => handleSaveClick(vendor._id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          setEditMode((prevEditMode) => ({
                            ...prevEditMode,
                            [vendor._id]: false,
                          }))
                        }
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => handleEditClick(vendor._id)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <AccordionContent>
                <div className="px-2 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <strong>Vendor ID: </strong>

                    {vendor._id}
                  </div>
                  <br />

                  <div className="flex items-center gap-2">
                    <b>Name </b>{" "}
                    {editMode[vendor._id] ? (
                      <Input
                        type="text"
                        value={editedData[vendor._id].name}
                        onChange={(e) =>
                          handleInputChange(vendor._id, "name", e.target.value)
                        }
                      />
                    ) : (
                      <>{vendor.name}</>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <b>Number </b>{" "}
                    {editMode[vendor._id] ? (
                      <Input
                        type="text"
                        value={editedData[vendor._id].number}
                        onChange={(e) =>
                          handleInputChange(
                            vendor._id,
                            "number",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <>{vendor.number}</>
                    )}
                  </div>
                  <br />
                  <div className="flex items-center gap-2">
                    <b>Alternate Number</b>{" "}
                    {editMode[vendor._id] ? (
                      <Input
                        type="text"
                        value={editedData[vendor._id].alternateNumber}
                        onChange={(e) =>
                          handleInputChange(
                            vendor._id,
                            "alternateNumber",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <>{vendor.alternateNumber}</>
                    )}
                  </div>
                  <br />
                  <div className="flex items-center gap-2">
                    <b>Password</b>{" "}
                    {editMode[vendor._id] ? (
                      <Input
                        type="text"
                        value={editedData[vendor._id].password}
                        onChange={(e) =>
                          handleInputChange(
                            vendor._id,
                            "password",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <>{vendor.password}</>
                    )}
                  </div>
                  <br />
                  <div className="flex items-center gap-2">
                    <b>Image URI</b>{" "}
                    {editMode[vendor._id] ? (
                      <Input
                        type="text"
                        value={editedData[vendor._id].imageURI}
                        onChange={(e) =>
                          handleInputChange(
                            vendor._id,
                            "imageURI",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <a
                        className="font-bold text-blue-800"
                        href={vendor.imageURI}
                        target="_blank"
                      >
                        Click To View
                      </a>
                    )}
                  </div>
                  <br />

                  <div>
                    <b>Delivery Locations:</b>{" "}
                    {editMode[vendor._id] ? (
                      <>
                        {editedData[vendor._id].deliveryLocations.map(
                          (location, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <Input
                                type="text"
                                value={location}
                                onChange={(e) =>
                                  handleInputChange(
                                    vendor._id,
                                    `deliveryLocations[${index}]`,
                                    e.target.value
                                  )
                                }
                              />
                              <Button
                                onClick={() =>
                                  handleRemoveLocation(vendor._id, index)
                                }
                              >
                                Remove
                              </Button>
                            </div>
                          )
                        )}
                        <div className="flex gap-2 ">
                          <Input
                            type="text"
                            placeholder="Add new location"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                          />
                          <Button
                            onClick={() =>
                              handleAddLocation(vendor._id, newLocation)
                            }
                          >
                            Add Location
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>{vendor.deliveryLocations.join(", ")}</>
                    )}
                  </div>
                  <br />
                  <div>
                    <b>Delivery Charges (For deliveries done by vendor):</b>{" "}
                    {editMode[vendor._id] ? (
                      <div>
                        {Object.entries(editedDeliveryCharges[vendor._id]).map(
                          ([location, charge]) => (
                            <div
                              key={location}
                              className="flex items-center gap-2 my-2 justify-between"
                            >
                              <span>{location}: </span>
                              <Input
                                className="w-1/4"
                                type="number"
                                value={charge}
                                onChange={(e) =>
                                  handleDeliveryChargeChange(
                                    vendor._id,
                                    location,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <>
                        {vendor.deliveryCharges
                          ? Object.entries(vendor.deliveryCharges).map(
                              ([location, charge]) => (
                                <div key={location}>
                                  <span>{location}: </span>
                                  <span>{charge} </span>
                                </div>
                              )
                            )
                          : "Delivery charges not set"}
                      </>
                    )}
                  </div>
                  <br />
                  <div>
                    <b>Min Order Value:</b>{" "}
                    {editMode[vendor._id] ? (
                      <div>
                        {Object.entries(editedMinOrders[vendor._id]).map(
                          ([location, order]) => (
                            <div
                              key={location}
                              className="flex items-center gap-2 my-2 justify-between"
                            >
                              <span>{location}: </span>
                              <Input
                                className="w-1/4"
                                type="number"
                                value={order}
                                onChange={(e) =>
                                  handleMinOrderChange(
                                    vendor._id,
                                    location,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <>
                        {vendor.minOrders
                          ? Object.entries(vendor.minOrders).map(
                              ([location, order]) => (
                                <div key={location}>
                                  <span>{location}: </span>
                                  <span>{order} </span>
                                </div>
                              )
                            )
                          : "Min orders not set"}
                      </>
                    )}
                  </div>
                  <br />
                  <div className="flex items-center gap-2 justify-between">
                    <b>Packing Handling Charges:</b>{" "}
                    {editMode[vendor._id] ? (
                      <Input
                        className="w-1/4"
                        type="text"
                        value={editedData[vendor._id].packingHandlingCharges}
                        onChange={(e) =>
                          handleInputChange(
                            vendor._id,
                            "packingHandlingCharges",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <>{vendor.packingHandlingCharges}</>
                    )}
                  </div>
                  <div className="flex items-center gap-2 justify-between">
                    <b>Service Charges:</b>{" "}
                    {editMode[vendor._id] ? (
                      <Input
                        className="w-1/4"
                        type="text"
                        value={editedData[vendor._id].serviceCharges}
                        onChange={(e) =>
                          handleInputChange(
                            vendor._id,
                            "serviceCharges",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <>{vendor.serviceCharges}</>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default VendorDetailsPage;
