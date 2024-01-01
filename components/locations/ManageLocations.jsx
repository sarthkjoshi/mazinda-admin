"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import OvalLoader from "@/components/utility/OvalLoader";
// import Switch from "react-switch";
import Modal from "react-modal";

const ManageLocations = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch locations when the component mounts
  const getLocations = async () => {
    try {
      const response = await axios.post("/api/location/fetch-locations");
      setLocations(response.data.locations);
      setPageLoading(false);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  const handleLocationClick = (location) => {
    setSelectedLocation(location); // Set the selected location for viewing/editing
    setIsModalOpen(true); // Open the modal when a location is clicked
  };

  const handleEdit = () => {
    // Implement functionality for editing the city name and pincodes
    // You may use a form within the modal for editing
    // Update the location details via an API call
  };

  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "30%",
      maxHeight: "30%",
      overflow: "auto",
      border: "1px solid #ccc",
      background: "#fff",
      WebkitOverflowScrolling: "touch",
      borderRadius: "15px",
      outline: "none",
      padding: "20px",
    },
  };

  return (
    <div className="shadow bg-white rounded-xl p-4">
      <h1 className="text-2xl mb-2 text-center">Manage Locations</h1>
      {!pageLoading ? (
        <>
          <div>
            <ul className="flex flex-wrap">
              {locations.map((location, index) => (
                <li
                  key={index}
                  className="px-10 py-6 border shadow rounded-2xl w-fit m-2 relative"
                  onClick={() => handleLocationClick(location)}
                >
                  {/* <div className="absolute top-1 right-2">
                    <Switch
                      checked={location.available}
                      onChange={() => {}}
                      onColor="#ff5a1f"
                      onHandleColor="#2693e6"
                      handleDiameter={14}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      height={12}
                      width={28}
                      className="react-switch"
                      id="material-switch"
                    />
                  </div> */}
                  <span className="text-xl font-bold">{location.city}</span>
                </li>
              ))}
            </ul>
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Location Details Modal"
            ariaHideApp={false}
            style={customStyles} // Apply custom style properties to the modal
          >
            {selectedLocation && (
              <div className="bg-white-500 z-50">
                <div className="flex justify-center items-center">
                  <h3 className="text-2xl font-bold text-center">
                    {selectedLocation.city}
                  </h3>
                  <button
                    onClick={handleEdit}
                    className="bg-orange-500 rounded-lg px-2 py-1 text-white font-bold mx-3"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex justify-center mt-2">
                  <ul className="flex flex-wrap">
                    {selectedLocation.pincodes.map((pincode, index) => (
                      <li
                        key={index}
                        className="border shadow px-3 py-1 w-fit rounded-full mx-2"
                      >
                        {pincode}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Modal>
        </>
      ) : (
        <OvalLoader />
      )}
    </div>
  );
};

export default ManageLocations;
