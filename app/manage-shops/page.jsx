"use client";

import { useState, useEffect } from "react";
import AvailableStores from "@/components/add-drop-store/AvailableStores";
import Overview from "@/components/add-drop-store/Overview";
import axios from "axios"; // Import axios
import OvalLoader from "@/components/utility/OvalLoader";

const AddDropStore = () => {
  const [storesLoading, setStoresLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("All"); // Initial filter

  useEffect(() => {
    // Fetch all stores when the component mounts
    const fetchStores = async () => {
      setStoresLoading(true);
      try {
        const response = await axios.post(
          "/api/add-drop-stores/fetch-all-stores"
        ); // Replace with your API endpoint
        if (response.data.success) {
          setStores(response.data.stores);
        } else {
          return "An error occurred";
        }
      } catch (error) {
        console.error("Error fetching stores: ", error);
      }
      setStoresLoading(false);
    };

    fetchStores();
  }, []);

  // Function to filter stores based on the current filter category
  const filterStores = () => {
    if (currentFilter === "All") {
      return stores; // Return all stores if the filter is "All"
    } else if (currentFilter === "Pending Requests") {
      return stores.filter((store) => store.approvedStatus === "pending");
    } else if (currentFilter === "Approved Stores") {
      return stores.filter((store) => store.approvedStatus === "approved");
    } else if (currentFilter === "Rejected Stores") {
      return stores.filter((store) => store.approvedStatus === "rejected");
    }
  };

  return (
    <>
      <h1 className="font-semibold text-3xl my-2">Add/Drop Store</h1>
      <Overview />
      <div className="my-2">
        <div className="w-full bg-white">
          <ul className="flex">
            <li
              className={`border border-gray-400 rounded-lg mx-3 px-2 py-1 hover:bg-gray-300 hover:cursor-pointer ${
                currentFilter === "All" ? "bg-gray-300" : ""
              }`}
              onClick={() => setCurrentFilter("All")}
            >
              All
            </li>
            <li
              className={`border border-gray-400 rounded-lg mx-3 px-2 py-1 hover:bg-gray-300 hover:cursor-pointer ${
                currentFilter === "Pending Requests" ? "bg-gray-300" : ""
              }`}
              onClick={() => setCurrentFilter("Pending Requests")}
            >
              Pending Requests
            </li>
            <li
              className={`border border-gray-400 rounded-lg mx-3 px-2 py-1 hover:bg-gray-300 hover:cursor-pointer ${
                currentFilter === "Approved Stores" ? "bg-gray-300" : ""
              }`}
              onClick={() => setCurrentFilter("Approved Stores")}
            >
              Approved Stores
            </li>
            <li
              className={`border border-gray-400 rounded-lg mx-3 px-2 py-1 hover:bg-gray-300 hover:cursor-pointer ${
                currentFilter === "Rejected Stores" ? "bg-gray-300" : ""
              }`}
              onClick={() => setCurrentFilter("Rejected Stores")}
            >
              Rejected Stores
            </li>
          </ul>
        </div>
        {!storesLoading ? (
          <AvailableStores
            stores={filterStores()}
            currentFilter={currentFilter}
          />
        ) : (
          <OvalLoader />
        )}
      </div>
    </>
  );
};

export default AddDropStore;
