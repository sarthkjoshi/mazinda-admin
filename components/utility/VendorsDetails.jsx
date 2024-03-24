"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
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
  // Function to parse date into a readable format
  const parseDate = (date) => {
    const d = new Date(date);
    return d.toString();
  };
  const handleToggleStore = async (number) => {
    try {
      const { data } = await axios.put("/api/vendorDetails/togglestore", {
        number,
      });

      if (data.success) {
        toast.success(data.message, { autoClose: 3000 });
      }
    } catch (err) {
      console.log("An error occurred: " + err.message);
    }
  };
  const handleToggleDisableShop = async (id) => {
    try {
      const { data } = await axios.put(
        "/api/vendorDetails/toggle-disable-shop",
        { id }
      );
      if (data.success) {
        toast.success(data.message, { autoClose: 3000 });
      }
    } catch (err) {
      console.log("An error occurred: " + err.message);
    }
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
      setVendorData(data.vendors);
      setFetchingData(false);
    };
    fetchVendors();
  }, []);

  const [vendorData, setVendorData] = useState([]);
  const [openVendorId, setOpenVendorId] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [editedData, setEditedData] = useState({});
  const [editedDeliveryCharges, setEditedDeliveryCharges] = useState({});
  const [editedMinOrders, setEditedMinOrders] = useState({});
  const [newLocation, setNewLocation] = useState("");
  const [editedDeliveryRequirements, setEditedDeliveryRequirements] = useState(
    {}
  );
  const [editedPayPercentage, setEditedPayPercentage] = useState({});
  const [editedWhatsappGroupId, setEditedWhatsappGroupId] = useState("");
  const [editedPriority, setEditedPriority] = useState("");
  const [error, setError] = useState({});
  const handleEditClick = (vendorId) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [vendorId]: true,
    }));
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [vendorId]: {
        ...vendorData.find((vendor) => vendor._id === vendorId),
      },
    }));
    setEditedDeliveryCharges((prevCharges) => ({
      ...prevCharges,
      [vendorId]: {
        ...vendorData.find((vendor) => vendor._id === vendorId).deliveryCharges,
      },
    }));
    setEditedMinOrders((prevOrders) => ({
      ...prevOrders,
      [vendorId]: {
        ...vendorData.find((vendor) => vendor._id === vendorId).minOrders,
      },
    }));
    setEditedDeliveryRequirements((prevDeliveryRequirements) => ({
      ...prevDeliveryRequirements,
      [vendorId]: {
        ...vendorData.find((vendor) => vendor._id === vendorId)
          .deliveryRequirements,
      },
    }));
    setEditedPayPercentage((prevPayPercentage) => ({
      ...prevPayPercentage,
      [vendorId]: vendorData.find((vendor) => vendor._id === vendorId)
        .payPercentage,
    }));
    setEditedWhatsappGroupId(
      vendorData.find((vendor) => vendor._id === vendorId).whatsapp_group_id
    );
  };

  const handleInputChange = (vendorId, fieldName, value) => {
    if (fieldName === "description" && value.length > 15) {
      setError({ [vendorId]: "Description cannot exceed 15 characters" });
    } else {
      setError({});
      setEditedData((prevEditedData) => ({
        ...prevEditedData,
        [vendorId]: {
          ...prevEditedData[vendorId],
          [fieldName]: value,
        },
      }));
    }
  };

  const handleDeliveryChargeChange = (vendorId, location, value) => {
    setEditedDeliveryCharges((prevCharges) => ({
      ...prevCharges,
      [vendorId]: {
        ...prevCharges[vendorId],
        [location]: value,
      },
    }));
  };

  const handleMinOrderChange = (vendorId, location, value) => {
    setEditedMinOrders((prevOrders) => ({
      ...prevOrders,
      [vendorId]: {
        ...prevOrders[vendorId],
        [location]: value,
      },
    }));
  };

  const handleDeliveryRequirementChange = (vendorId, location, value) => {
    setEditedDeliveryRequirements((prevDeliveryRequirements) => ({
      ...prevDeliveryRequirements,
      [vendorId]: {
        ...prevDeliveryRequirements[vendorId],
        [location]: value,
      },
    }));
  };

  const handlePayPercentageChange = (vendorId, value) => {
    setEditedPayPercentage((prevPayPercentage) => ({
      ...prevPayPercentage,
      [vendorId]: value,
    }));
  };

  const handleWhatsappGroupIdChange = (value) => {
    setEditedWhatsappGroupId(value);
  };
  const handlePriorityChange = (value) => {
    setEditedPriority(value);
  };
  const handleSaveClick = async (vendorId) => {
    const updatedVendor = editedData[vendorId];
    const updatedDeliveryCharges = editedDeliveryCharges[vendorId];
    const updatedMinOrders = editedMinOrders[vendorId];
    updatedVendor.deliveryCharges = updatedDeliveryCharges;
    updatedVendor.minOrders = updatedMinOrders;
    updatedVendor.deliveryRequirements = editedDeliveryRequirements[vendorId];
    updatedVendor.payPercentage = editedPayPercentage[vendorId];
    updatedVendor.whatsapp_group_id = editedWhatsappGroupId;
    updatedVendor.priority = editedPriority;

    setVendorData((prevData) =>
      prevData.map((vendor) =>
        vendor._id === vendorId ? { ...vendor, ...updatedVendor } : vendor
      )
    );

    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [vendorId]: false,
    }));

    const { data } = await axios.post("/api/vendorDetails", {
      updatedVendor,
    });
    toast.success(data.message);
  };

  useEffect(() => {
    setFetchingData(true);
    const fetchVendors = async () => {
      const { data } = await axios.get("/api/vendorDetails");
      setVendorData(data.vendors);
      setFetchingData(false);
    };
    fetchVendors();
  }, []);

  return (
    <div className="p-4 md:w-1/2 bg-white">
      <h1 className="text-2xl font-semibold mb-5 text-center">
        Vendor Details
      </h1>
      {fetchingData ? (
        <OvalLoader />
      ) : (
        <Accordion type="single" collapsible>
          {vendorData.map((vendor) => (
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
                  {/* <Badge
                    
                    className="bg-green-500 cursor-pointer hover:bg-green-600 p-2"
                  >
                    {"Toggle"}
                  </Badge> */}
                  {vendor.openStatus ? (
                    <Badge className="bg-[#e6f6eb] text-[#1f8256]">Open</Badge>
                  ) : (
                    <Badge className="bg-[#ffefd6] text-[#cc4f01]">
                      Closed
                    </Badge>
                  )}
                  <Switch
                    id="shop-disable"
                    checked={vendor.openStatus}
                    onCheckedChange={(checked) => {
                      // let updatedVendor = vendor.filter(v => v._id === vendor._id);
                      // updatedVendor.disabled = checked;
                      setVendorData((prevData) => {
                        let updatedData = [...prevData];
                        updatedData = updatedData.map((v) =>
                          v._id === vendor._id
                            ? { ...v, openStatus: checked }
                            : v
                        );

                        return updatedData;
                      });
                    }}
                    onClick={() => handleToggleStore(vendor.number)}
                  />
                </div>
              </div>
              <AccordionContent>
                <div className="px-2 flex flex-col gap-3">
                  <div className="w-full flex justify-between mt-5 items-center">
                    <div className="flex items-center space-x-2">
                      {!vendor.disabled ? (
                        <Badge className="bg-[#e6f6eb] text-[#1f8256]">
                          Enabled
                        </Badge>
                      ) : (
                        <Badge className="bg-[#ffefd6] text-[#cc4f01]">
                          Disabled
                        </Badge>
                      )}
                      <Switch
                        id="shop-disable"
                        checked={vendor.disabled}
                        onCheckedChange={(checked) => {
                          setVendorData((prevData) => {
                            let updatedData = [...prevData];
                            updatedData = updatedData.map((v) =>
                              v._id === vendor._id
                                ? { ...v, disabled: checked }
                                : v
                            );

                            return updatedData;
                          });
                        }}
                        onClick={() => handleToggleDisableShop(vendor._id)}
                      />
                    </div>

                    {editMode[vendor._id] ? (
                      <div className="flex gap-2">
                        <Button
                          className="bg-green-500 px-4 hover:bg-green-600"
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
                      <div className="flex">
                        <Button
                          variant="secondary"
                          onClick={() => handleEditClick(vendor._id)}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  <br />
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
                  <div className="flex items-center gap-2">
                    <b>Description</b>{" "}
                    {editMode[vendor._id] ? (
                      <Input
                        type="text"
                        value={editedData[vendor._id]?.description || ""}
                        onChange={(e) =>
                          handleInputChange(
                            vendor._id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <>{vendor.description}</>
                    )}
                  </div>
                  {error[vendor._id] && (
                    <div className="text-red-500">{error[vendor._id]}</div>
                  )}
                  <br />
                  <div>
                    <b>Delivery Charges (For deliveries done by vendor):</b>
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
                  <br />
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
                  <br />
                  <div className="flex gap-2">
                    <b>Pay Percentage:</b>
                    {editMode[vendor._id] ? (
                      <Input
                        type="number"
                        value={editedPayPercentage[vendor._id]}
                        onChange={(e) =>
                          handlePayPercentageChange(vendor._id, e.target.value)
                        }
                      />
                    ) : (
                      <div>{vendor.payPercentage}</div>
                    )}
                  </div>
                  <br />
                  <div className="flex gap-2">
                    <b>WhatsApp Group ID:</b>
                    {editMode[vendor._id] ? (
                      <Input
                        type="text"
                        value={editedWhatsappGroupId}
                        onChange={(e) =>
                          handleWhatsappGroupIdChange(e.target.value)
                        }
                      />
                    ) : (
                      <div>{vendor.whatsapp_group_id}</div>
                    )}
                  </div>
                  <br />
                  <div className="flex gap-2">
                    <b>Priority:</b>
                    {editMode[vendor._id] ? (
                      <Input
                        type="text"
                        value={editedPriority}
                        onChange={(e) => handlePriorityChange(e.target.value)}
                      />
                    ) : (
                      <div>{vendor.priority}</div>
                    )}
                  </div>
                  <br />
                  <div>
                    <b>Delivery Requirements:</b>
                    {editMode[vendor._id] ? (
                      <div>
                        {Object.entries(
                          editedDeliveryRequirements[vendor._id]
                        ).map(([location, requirement]) => (
                          <div
                            key={location}
                            className="flex flex-col gap-2 my-2 border border-gray-300 p-2 rounded-lg"
                          >
                            <div className="text-md font-bold">{location}:</div>
                            <div className="flex gap-2 items-center">
                              <span>Charge: </span>
                              <Input
                                type="number"
                                value={requirement.charge}
                                onChange={(e) =>
                                  handleDeliveryRequirementChange(
                                    vendor._id,
                                    location,
                                    { ...requirement, charge: e.target.value }
                                  )
                                }
                              />
                            </div>
                            <div className="flex gap-2 items-center">
                              <span>Min Order: </span>
                              <Input
                                type="number"
                                value={requirement.minOrder}
                                onChange={(e) =>
                                  handleDeliveryRequirementChange(
                                    vendor._id,
                                    location,
                                    { ...requirement, minOrder: e.target.value }
                                  )
                                }
                              />
                            </div>
                            <div className="flex gap-2 items-center">
                              <span>Max Order: </span>
                              <Input
                                type="number"
                                value={requirement.maxOrder}
                                onChange={(e) =>
                                  handleDeliveryRequirementChange(
                                    vendor._id,
                                    location,
                                    { ...requirement, maxOrder: e.target.value }
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        {Object.entries(vendor.deliveryRequirements).map(
                          ([location, requirement]) => (
                            <div
                              key={location}
                              className="flex flex-col gap-2 my-2 border border-gray-300 p-2 rounded-lg"
                            >
                              <div className="text-md font-bold">
                                {location}:
                              </div>
                              <div className="flex gap-2 items-center">
                                <span>Charge:{requirement.charge} </span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span>Min Order:{requirement.minOrder} </span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span>Max Order:{requirement.maxOrder} </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
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
