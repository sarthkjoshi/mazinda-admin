"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import OvalLoader from "./OvalLoader";
import { MinusCircle, PlusCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function trimToLastNCharacters(str, n) {
  if (typeof str !== "string" || typeof n !== "number" || n < 0) {
    return "Invalid input";
  }
  return str.substring(str.length - n);
}
const MoneyManagement = () => {
  const [vendorData, setVendorData] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    setFetchingData(true);
    const fetchVendors = async () => {
      try {
        const response = await axios.get("/api/vendorDetails");
        const data = await response.data;
        setVendorData(data);
        setFetchingData(false);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="container mx-auto p-4 md:w-2/3">
      <h1 className="text-2xl font-semibold mb-5 text-center">
        Money Management
      </h1>
      <Accordion type="single" collapsible className="w-full">
        {fetchingData ? (
          <OvalLoader />
        ) : (
          <ul>
            {vendorData.vendors.map((vendor) => (
              <AccordionItem value={vendor._id} className="my-2">
                <div className="border border-gray-300 rounded-md p-2">
                  <AccordionTrigger>
                    <h2 className="text-lg font-semibold">{vendor.name}</h2>
                    <p>Current Pay Percentage: {vendor.payPercentage}</p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Accordions payouts={vendor.payouts} name={vendor.name} />
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </ul>
        )}
      </Accordion>
    </div>
  );
};

const Accordions = ({ payouts, name }) => {
  const [open, setOpen] = useState(null);

  const handleAccordions = (date) => {
    setOpen((prev) => (prev === date ? null : date));
  };

  return (
    <div>
      {Object.keys(payouts).map((date) => (
        <div key={date} className="border-t mt-2">
          <div
            className="flex justify-between cursor-pointer"
            onClick={() => handleAccordions(date)}
          >
            <p className="font-semibold">{date}</p>
            <p>{payouts[date].length} payouts</p>
            {open === date ? <MinusCircle /> : <PlusCircle />}
          </div>
          {open === date && (
            <>
              <h2>
                Dear <strong>{name}</strong>, find the settlement details for{" "}
                {date} below:
              </h2>
              <ul className="mt-2">
                {payouts[date].map((payout, index) => (
                  <li key={index} className="flex flex-col gap-2  p-2">
                    <p>
                      <strong>Order ID:</strong>
                      {trimToLastNCharacters(payout.orderId, 5)}
                    </p>
                    <p>
                      <strong>Amount: ₹</strong> {payout.totalAmount}
                    </p>
                  </li>
                ))}
                <li className="font-semibold border-t p-2">
                  Total Amount To Be Paid Today: ₹
                  {payouts[date].reduce(
                    (total, payout) => total + payout.totalAmount,
                    0
                  )}
                </li>
              </ul>
              <table className="w-full mt-4 ">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Order ID</th>
                    <th className="border px-4 py-2">Total Amount</th>
                    <th className="border px-4 py-2">Pay Percentage</th>
                    <th className="border px-4 py-2">Service Charge</th>
                    <th className="border px-4 py-2">Packing Handling</th>
                    <th className="border px-4 py-2">External Delivery</th>
                    <th className="border px-4 py-2">Delivery</th>
                    <th className="border px-4 py-2">Final Vendor Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts[date].map((payout, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        {trimToLastNCharacters(payout.orderId, 5)}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{payout.totalAmount}
                      </td>
                      <td className="border px-4 py-2">
                        {payout.payPercentage}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{payout.serviceCharge}
                      </td>
                      <td className="border px-4 py-2">
                        {payout.handlingCharge}
                      </td>
                      <td className="border px-4 py-2">
                        {payout.externalDeliveryRequiredt === true
                          ? "Yes"
                          : "NO"}
                      </td>
                      <td className="border px-4 py-2">
                        {payout.deliveryCharge}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{payout.finalVendorAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MoneyManagement;
