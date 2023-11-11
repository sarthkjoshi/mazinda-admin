"use client";

import React, { useState } from "react";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
import Link from "next/link";

const DeliveryRequests = () => {
  // Sample delivery requests data
  const deliveryRequests = [
    {
      id: 1,
      name: "John Doe",
      phone: "123-456-7890",
      email: "johndoe@example.com",
      location: "New York",
      aadhar: "1234 5678 9012",
      panCard: "ABCPD1234E",
      bankAccount: "9876543210",
      branchName: "Main Branch",
      ifscCode: "XYZA12345",
    },
    {
      id: 2,
      name: "Jane Smith",
      phone: "987-654-3210",
      email: "janesmith@example.com",
      location: "Los Angeles",
      aadhar: "5678 9012 3456",
      panCard: "XYZAB5678F",
      bankAccount: "1234567890",
      branchName: "Downtown Branch",
      ifscCode: "ABCD67890",
    },
  ];

  return (
    <div className="m-2 p-4 bg-white h-3/4 overflow-y-scroll">
      <h1 className="text-2xl">Pending Requests</h1>
      {deliveryRequests.map((request) => (
        <div key={request.id} className="bg-gray-50 rounded-lg p-4 my-4 border">
          <div className="text-green-500 mb-1">
            {/* <LocationOnIcon className="text-green-500 text-md" /> */}
            {request.location}
          </div>
          <h2 className="text-lg font-semibold">{request.name}</h2>
          <p className="text-gray-600 mb-2 text-sm">{request.phone}</p>
          <Link className="underline text-lg text-[#f96b1d]" href="#">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DeliveryRequests;
