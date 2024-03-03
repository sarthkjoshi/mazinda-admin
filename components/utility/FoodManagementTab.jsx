"use client";
import React, { useState } from "react";

import FoodOrdersList from "@/components/utility/FoodOrderList";
import VendorDetailsPage from "./VendorsDetails";
import VendorForm from "./VendorForm";
import MoneyManagement from "./Moneymanagement";

const FoodManagementTab = ({ filter }) => {
  const [activeTab, setActiveTab] = useState("foodorders");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <div className="mb-4 rounded-lg shadow border-gray-200 bg-white mt-4">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center"
          id="default-tab"
          role="tablist"
        >
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "foodorders"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              id="foodorders-tab"
              type="button"
              role="tab"
              aria-controls="foodorders"
              aria-selected={activeTab === "foodorders"}
              onClick={() => handleTabClick("foodorders")}
            >
              Food Orders
            </button>
          </li>
          {/* New Tab for Food Vendors */}
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "vendors"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              id="vendors-tab"
              type="button"
              role="tab"
              aria-controls="vendors"
              aria-selected={activeTab === "vendors"}
              onClick={() => handleTabClick("vendors")}
            >
              Food Vendors
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "vendor-form"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              id="vendorsform-tab"
              type="button"
              role="tab"
              aria-controls="vendor-form"
              aria-selected={activeTab === "vendor-form"}
              onClick={() => handleTabClick("vendor-form")}
            >
              Add Vendor
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "moneymanagement"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              id="moneymanagement-tab"
              type="button"
              role="tab"
              aria-controls="moneymanagement"
              aria-selected={activeTab === "moneymanagement"}
              onClick={() => handleTabClick("moneymanagement")}
            >
              Money Management
            </button>
          </li>
        </ul>
      </div>
      <div id="default-tab-content">
        <div
          className={`rounded-lg bg-gray-50 dark:bg-gray-800 ${
            activeTab === "foodorders" ? "block" : "hidden"
          }`}
          id="foodorders"
          role="tabpanel"
          aria-labelledby="foodorders-tab"
        >
          <FoodOrdersList filter={filter} />
        </div>
        <div
          className={`rounded-lg bg-gray-50 dark:bg-gray-800 ${
            activeTab === "vendors" ? "block" : "hidden"
          }`}
          id="vendors"
          role="tabpanel"
          aria-labelledby="vendors-tab"
        >
          <VendorDetailsPage />
        </div>
        <div
          className={`rounded-lg bg-gray-50 dark:bg-gray-800 ${
            activeTab === "vendor-form" ? "block" : "hidden"
          }`}
          id="vendor-form"
          role="tabpanel"
          aria-labelledby="vendorsform-tab"
        >
          <VendorForm />
        </div>
        <div
          className={`rounded-lg bg-gray-50 dark:bg-gray-800 ${
            activeTab === "moneymanagement" ? "block" : "hidden"
          }`}
          id="moneymanagement"
          role="tabpanel"
          aria-labelledby="moneymanagement-tab"
        >
          <MoneyManagement />
        </div>
      </div>
    </>
  );
};

export default FoodManagementTab;
