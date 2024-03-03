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

  // Function to handle input changes in the edit mode for menu items
  const handleMenuItemChange = (vendorId, category, index, field, value) => {
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [vendorId]: {
        ...prevEditedData[vendorId],
        menu: {
          ...prevEditedData[vendorId].menu,
          [category]: prevEditedData[vendorId].menu[category].map((item, idx) =>
            idx === index ? { ...item, [field]: value } : item
          ),
        },
      },
    }));
  };
  const handleRemoveMenuItem = (vendorId, category, indexToRemove) => {
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [vendorId]: {
        ...prevEditedData[vendorId],
        menu: {
          ...prevEditedData[vendorId].menu,
          [category]: prevEditedData[vendorId].menu[category].filter(
            (_, index) => index !== indexToRemove
          ),
        },
      },
    }));
  };

  // Function to handle adding a new menu item
  const handleAddMenuItem = (vendorId, category) => {
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [vendorId]: {
        ...prevEditedData[vendorId],
        menu: {
          ...prevEditedData[vendorId].menu,
          [category]: [
            ...(prevEditedData[vendorId].menu[category] || []),
            {
              name: "",
              price: "",
              categoryType: "",
              availability: "",
              imageName: "",
            },
          ],
        },
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

  const handleEditClick = (vendorId) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [vendorId]: true,
    }));
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [vendorId]: {
        ...vendorData.vendors.find((vendor) => vendor._id === vendorId),
      },
    }));
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
    setEditedDeliveryRequirements((prevDeliveryRequirements) => ({
      ...prevDeliveryRequirements,
      [vendorId]: {
        ...vendorData.vendors.find((vendor) => vendor._id === vendorId)
          .deliveryRequirements,
      },
    }));
    setEditedPayPercentage((prevPayPercentage) => ({
      ...prevPayPercentage,
      [vendorId]: vendorData.vendors.find((vendor) => vendor._id === vendorId)
        .payPercentage,
    }));
    setEditedWhatsappGroupId(
      vendorData.vendors.find((vendor) => vendor._id === vendorId)
        .whatsapp_group_id
    );
  };

  const handleInputChange = (vendorId, fieldName, value) => {
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [vendorId]: {
        ...prevEditedData[vendorId],
        [fieldName]: value,
      },
    }));
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

  const handleSaveClick = async (vendorId) => {
    const updatedVendor = editedData[vendorId];
    const updatedDeliveryCharges = editedDeliveryCharges[vendorId];
    const updatedMinOrders = editedMinOrders[vendorId];
    updatedVendor.deliveryCharges = updatedDeliveryCharges;
    updatedVendor.minOrders = updatedMinOrders;
    updatedVendor.deliveryRequirements = editedDeliveryRequirements[vendorId];
    updatedVendor.payPercentage = editedPayPercentage[vendorId];
    updatedVendor.whatsapp_group_id = editedWhatsappGroupId;

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

    const { data } = await axios.post("/api/vendorDetails", {
      updatedVendor,
    });
    toast.success(data.message);
  };

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
    <div className="p-4 md:w-1/2 bg-white rounded-lg">
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
                                className="bg-red-500"
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
                            variant="secondary"
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
                  <hr />
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
                  <hr />
                  <div className="flex items-center gap-2">
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
                  <div className="flex items-center gap-2">
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
                  <hr />
                  <div>
                    <b>External Delivery Requirements:</b>
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

                  <div className="gap-2">
                    <b className="text-lg">Menu:</b>{" "}
                    {editMode[vendor._id] &&
                    Object.keys(editedData[vendor._id].menu).length > 0 ? (
                      <>
                        {Object.entries(editedData[vendor._id].menu).map(
                          ([category, items]) => (
                            <div key={category} className="mt-4">
                              <h3 className="font-bold">{category}:</h3>
                              {items.map((item, index) => (
                                <div
                                  key={index}
                                  className=" rounded-lg border border-gray-300 mb-2 p-3"
                                >
                                  <div className="flex gap-1 items-center mb-1">
                                    <p>Name:</p>
                                    <Input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) =>
                                        handleMenuItemChange(
                                          vendor._id,
                                          category,
                                          index,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Name"
                                    />
                                  </div>
                                  <div className="flex gap-1 items-center mb-1">
                                    <p>Price:</p>
                                    <Input
                                      type="number"
                                      value={item.price}
                                      onChange={(e) =>
                                        handleMenuItemChange(
                                          vendor._id,
                                          category,
                                          index,
                                          "price",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Price"
                                    />
                                  </div>
                                  <div className="flex gap-1 items-center mb-1">
                                    <p>Category Type:</p>
                                    <Input
                                      type="text"
                                      value={item.categoryType}
                                      onChange={(e) =>
                                        handleMenuItemChange(
                                          vendor._id,
                                          category,
                                          index,
                                          "categoryType",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Category Type"
                                    />
                                  </div>
                                  <div className="flex gap-1 items-center mb-1">
                                    <p>Availability:</p>
                                    <Input
                                      type="text"
                                      value={item.availability}
                                      onChange={(e) =>
                                        handleMenuItemChange(
                                          vendor._id,
                                          category,
                                          index,
                                          "availability",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Availability"
                                    />
                                  </div>
                                  <div className="flex gap-1 items-center mb-1">
                                    <p>Image:</p>
                                    <Input
                                      type="text"
                                      value={item.imageName}
                                      onChange={(e) =>
                                        handleMenuItemChange(
                                          vendor._id,
                                          category,
                                          index,
                                          "imageName",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Image Name"
                                    />
                                  </div>
                                  <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() =>
                                      handleRemoveMenuItem(
                                        vendor._id,
                                        category,
                                        index
                                      )
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                className="text-green-500 hover:text-green-700"
                                onClick={() =>
                                  handleAddMenuItem(vendor._id, category)
                                }
                              >
                                Add Item
                              </button>
                            </div>
                          )
                        )}
                      </>
                    ) : (
                      <>
                        {Object.keys(vendor.menu).length > 0 ? (
                          <>
                            {Object.entries(vendor.menu).map(
                              ([category, items]) => (
                                <div key={category} className="mt-4">
                                  <h3 className="font-bold">{category}:</h3>
                                  {items.map((item, index) => (
                                    <div
                                      key={index}
                                      className="rounded-lg border border-gray-300 mb-2 p-3"
                                    >
                                      <p>Name: {item.name}</p>
                                      <p>Price: {item.price}</p>
                                      <p>Category Type: {item.categoryType}</p>
                                      <p>Availability: {item.availability}</p>
                                      <p>Image: {item.imageName}</p>
                                    </div>
                                  ))}
                                </div>
                              )
                            )}
                          </>
                        ) : (
                          <p>No menu items available</p>
                        )}
                      </>
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
