"use client";
import React, { useEffect, useState } from "react";
import OvalLoader from "./OvalLoader";
import axios from "axios";
import { ChevronsDown, ChevronsUp } from "lucide-react";

export default function Priority() {
  const [fetchingData, setFetchingData] = useState(true);
  const [vendorData, setVendorData] = useState([]);

  useEffect(() => {
    setFetchingData(true);
    const fetchVendors = async () => {
      const { data } = await axios.get("/api/vendorDetails");
      setVendorData(data.vendors);
      setFetchingData(false);
    };
    fetchVendors();
  }, []);

  const updatePriority = async (vendorId, newPriority) => {
    try {
      await axios.put(`/api/vendorDetails/priority`, {
        vendorId: vendorId,
        priority: newPriority,
      });

      setVendorData((prevState) =>
        prevState.map((vendor) =>
          vendor._id === vendorId
            ? { ...vendor, priority: newPriority }
            : vendor
        )
      );
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const increasePriority = async (vendorId, currentPriority) => {
    let newPriority = currentPriority + 1;
    if (isNaN(newPriority)) {
      newPriority = 1;
    }
    await updatePriority(vendorId, newPriority);
  };

  const decreasePriority = async (vendorId, currentPriority) => {
    let newPriority = Math.max(currentPriority - 1, 1);
    if (isNaN(newPriority)) {
      newPriority = 1;
    }
    await updatePriority(vendorId, newPriority);
  };

  return (
    <div className="p-4 md:w-1/2 bg-white">
      <h1 className="text-2xl font-semibold mb-5 text-center">Priority</h1>

      {fetchingData ? (
        <OvalLoader />
      ) : (
        <div>
          {vendorData.map((vendor) => {
            return (
              <div key={vendor._id}>
                <p>{vendor.name}</p>
                <div className="flex gap-2">
                  <b>Priority:</b>
                  <span>{vendor.priority}</span>
                  <button
                    onClick={() =>
                      increasePriority(vendor._id, vendor.priority)
                    }
                  >
                    <ChevronsUp />
                  </button>
                  <button
                    onClick={() =>
                      decreasePriority(vendor._id, vendor.priority)
                    }
                  >
                    <ChevronsDown />
                  </button>
                </div>
                <br />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
