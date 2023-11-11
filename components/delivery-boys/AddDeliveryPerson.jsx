"use client";

import React, { useState } from "react";

const AddDeliveryPerson = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="bg-white rounded-xl p-4 mx-2 shadow">
      <div className="flex items-center flex-col">
        <h2 className="text-2xl">Manually add a delivery person</h2>
        <button
          onClick={toggleForm}
          className="bg-[#f96b1d] hover:opacity-70 text-white font-bold py-2 px-4 mt-4 rounded-full w-fit"
        >
          {showForm ? "Close" : "Add"}
        </button>
      </div>

      {showForm && (
        <div className="mt-4">
          <form>
            <div className="flex">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  User Name
                </label>
                <input
                  type="text"
                  className="shadow text-sm appearance-none border py-1 px-2 text-gray-700 leading-tight focus:shadow-outline rounded-full w-4/5"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Phone/Contact
                </label>
                <input
                  type="text"
                  className="shadow text-sm appearance-none border py-1 px-2 text-gray-700 leading-tight focus:shadow-outline rounded-full w-4/5"
                />
              </div>
            </div>

            <div className="flex">
              <div className="mb-4 w-3/4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="shadow text-sm appearance-none border py-1 px-2 text-gray-700 leading-tight focus:shadow-outline rounded-full w-5/6"
                />
              </div>
              <div className="mb-4 w-1/4 mr-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Location City
                </label>
                <input
                  type="text"
                  className="shadow text-sm appearance-none border py-1 px-2 text-gray-700 leading-tight focus:shadow-outline rounded-full w-full"
                />
              </div>
            </div>
            <div className="flex">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  className="shadow text-sm appearance-none border py-1 px-2 text-gray-700 leading-tight focus:shadow-outline rounded-full w-4/5"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  PAN Card Number
                </label>
                <input
                  type="text"
                  className="shadow text-sm appearance-none border py-1 px-2 text-gray-700 leading-tight focus:shadow-outline rounded-full w-4/5"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Bank Account Number
              </label>
              <input
                type="text"
                className="shadow text-sm appearance-none border py-1 px-2 text-gray-700 leading-tight focus:shadow-outline rounded-full w-4/5"
              />
            </div>
            <div className="flex">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Branch Name
                </label>
                <input
                  type="text"
                  className="shadow text-sm appearance-none border py-1 px-2 text-gray-700 leading-tight focus:shadow-outline rounded-full w-4/5"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  className="shadow text-sm appearance-none border py-1 px-2 text-gray-700 leading-tight focus:shadow-outline rounded-full w-4/5"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#28c266] hover:opacity-70 text-white font-bold py-2 px-4 mt-4 rounded-full w-full"
            >
              Add Delivery Person
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddDeliveryPerson;
