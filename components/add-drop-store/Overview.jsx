import { useState, useEffect } from "react";
import axios from "axios";

const Overview = () => {
  const [totalStores, setTotalStores] = useState(0);
  const [pendingStores, setPendingStores] = useState(0);

  useEffect(() => {
    const getTotalStores = async () => {
      const response = await axios.post("/api/store/total-stores");
      if (response.data.success) {
        setTotalStores(response.data.totalStores);
      } else {
        setTotalStores("N/A");
      }
    };
    getTotalStores();

    const getPendingStores = async () => {
      const response = await axios.post("/api/store/pending-stores");
      if (response.data.success) {
        setPendingStores(response.data.pendingStores);
      } else {
        setPendingStores("N/A");
      }
    };
    getPendingStores();
  }, []);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="font-semibold text-xl text-gray-800">Overview</h2>
      <div className="flex my-2">
        <div className="w-1/3 bg-red-500 p-4 text-white rounded-xl mx-2">
          <span className="mr-5 block">Total Stores</span>
          <span className="block text-3xl font-bold">{totalStores}</span>
        </div>

        <div className="w-1/3 bg-yellow-700 p-4 text-white rounded-xl mx-2">
          <span className="mr-5 block">Pending Store Requests</span>
          <span className="block text-3xl font-bold">{pendingStores}</span>
        </div>

        <div className="w-1/3 bg-pink-400 p-4 text-white rounded-xl mx-2">
          <span className="mr-5 block">Stores in {"<Chandigarh>"}</span>
          <span className="block text-3xl font-bold">122</span>
        </div>
      </div>
    </div>
  );
};

export default Overview;
