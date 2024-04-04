"use client";

import { useState, useEffect } from "react";
import AvailableStores from "@/components/add-drop-store/AvailableStores";
import Overview from "@/components/add-drop-store/Overview";
import axios from "axios";
import OvalLoader from "@/components/utility/OvalLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

const AddDropStore = () => {
  const router = useRouter();
  const [storesLoading, setStoresLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const filter = useSearchParams().get("filter") || "all";
  // const [filter, setfilter] = useState("All"); // Initial filter

  useEffect(() => {
    // Fetch all stores when the component mounts
    const fetchStores = async () => {
      setStoresLoading(true);
      try {
        const { data } = await axios.post(
          "/api/add-drop-stores/fetch-all-stores"
        ); // Replace with your API endpoint
        if (data.success) {
          setStores(data.stores);
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

  const redirect = (filter) => {
    router.push(`?filter=${filter}`);
  };

  // Function to filter stores based on the current filter category
  const filterStores = () => {
    if (filter === "all") {
      return stores; // Return all stores if the filter is "All"
    } else {
      return stores.filter((store) => store.approvedStatus === filter);
    }
  };

  if (storesLoading) {
    return <OvalLoader />;
  }

  return (
    <>
      <h1 className="font-semibold text-3xl my-2">Manage Shops</h1>
      {/* <Overview /> */}
      <div className="w-full bg-white p-4 rounded-lg">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger onClick={() => redirect("all")} value="all">
              All
            </TabsTrigger>
            <TabsTrigger onClick={() => redirect("pending")} value="pending">
              Pending
            </TabsTrigger>
            <TabsTrigger onClick={() => redirect("approved")} value="approved">
              Approved
            </TabsTrigger>
            <TabsTrigger onClick={() => redirect("rejected")} value="rejected">
              Rejected
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <AvailableStores stores={filterStores()} filter={filter} />
      </div>
    </>
  );
};

export default AddDropStore;
