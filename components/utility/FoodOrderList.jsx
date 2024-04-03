"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import OvalLoader from "./OvalLoader";
import Mode from "./Mode";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FoodOrderList = () => {
  const router = useRouter();

  //for delivery boys
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState("");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // States for cancel and delete button confirmations
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [allDeliveredButtonLoading, setAllDeliveredButtonLoading] =
    useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.post(`/api/food/order/fetch`, {
          page,
          perPage: 10,
        });
        const newOrders = data.food_orders;

        if (newOrders.length < 10) {
          setHasMore(false);
        }

        if (page === 1) {
          // If this is the initial fetch, set orders
          setOrders(newOrders);
        } else {
          // If this is not the initial fetch, append to orders
          setOrders((prevOrders) => prevOrders.concat(newOrders));
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router, page]); // Include router as a dependency

  useEffect(() => {
    // Fetch list of delivery boys when component mounts
    axios
      .get("/api/deliveryBoys")
      .then((response) => {
        setDeliveryBoys(response.data.deliveryBoys);
      })
      .catch((error) => {
        console.error("Error fetching delivery boys:", error);
      });
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const loadMore = async () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const convertToCSV = (data) => {
    const csvData = data.map((order) => {
      const products = Object.keys(order.products)
        .map((productName) => {
          return `"${productName} ${order.products[productName].quantity}"`;
        })
        .join(",");

      const row = [
        order._id,
        order.status,
        order.amount.toFixed(2),
        new Date(order.createdAt).toLocaleString(),
        `"${order.vendorName}"`,
        `"${order.userName}"`,
        `"${order.address.hostel}"`,
        `"${order.address.campus}"`,
        `"${order.address.phoneNumber}"`,
        `"${order.address.instructions}"`,
        products,
      ].join(",");

      return `${row}\n`;
    });

    const header =
      "Order ID,Status,Total Amount,Order Date,Order Time,Vendor,User,Hostel,Campus,Phone Number,Instructions,Products";
    return `${header}\n${csvData.join("")}`;
  };

  // Function to trigger the CSV download
  const downloadCSV = () => {
    const csvData = convertToCSV(orders);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "orders.csv");
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOrderCancel = async (orderId) => {
    try {
      const { data } = await axios.put("/api/order/updateorderstatus", {
        orderId,
        status: "Cancelled",
      });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteOrderClick = async (orderId) => {
    try {
      const response = await axios.post("/api/order/deleteorder", { orderId });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAllDeliveredClick = async () => {
    setAllDeliveredButtonLoading(true);
    const { data } = await axios.put(
      "/api/food/order/set-all-orders-delivered"
    );
    console.log(data);
    if (data.success) {
      toast.success(
        'All orders with "Processing" or "Out for delivery" set to "Delivered"'
      );
    }
    setAllDeliveredButtonLoading(false);
  };
  const handleAssignDeliveryBoy = (
    orderId,
    vendorName,
    products,
    address,
    amount
  ) => {
    // Find the selected delivery boy object
    const selectedDeliveryBoyObj = deliveryBoys.find(
      (deliveryBoy) => deliveryBoy._id === selectedDeliveryBoy
    );

    if (!selectedDeliveryBoyObj) {
      console.error("Selected delivery boy not found");
      return;
    }

    const { groupid } = selectedDeliveryBoyObj;
    console.log("groupid", groupid);
    axios
      .put(`/api/deliveryBoys`, {
        deliveryBoyId: selectedDeliveryBoy,
        groupid, // Use groupId from selected delivery boy object
        orderId,
        vendorName,
        products,
        address,
        amount,
      })
      .then((response) => {
        // Handle success
        if (response.data.success === true) {
          alert("Order assigned to delivery boy successfully");
        }
      })
      .catch((error) => {
        console.error("Error assigning delivery boy to order:", error);
      });
  };
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <div className="flex gap-2 mb-2">
        <button
          onClick={downloadCSV}
          className="bg-black hover:opacity-75 text-white py-2 px-4 rounded text-sm"
        >
          Export CSV
        </button>
        <button
          onClick={handleAllDeliveredClick}
          className="bg-green-500 hover:opacity-75 text-white py-2 px-4 rounded"
        >
          {allDeliveredButtonLoading ? <OvalLoader /> : "Set Delivered"}
        </button>
      </div>
      <div>
        <Mode />
      </div>
      {loading ? (
        <OvalLoader />
      ) : error ? (
        <p className="text-lg text-red-500 text-center">
          Error: {error.message}
        </p>
      ) : orders.length === 0 ? (
        <p className="text-lg text-gray-600 text-center my-5">No orders</p>
      ) : (
        <div>
          <InfiniteScroll
            dataLength={orders.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<OvalLoader />}
          >
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow border rounded-lg mb-6 px-4 pt-4 pb-1 cursor-pointer md:w-1/2"
                onClick={() => toggleExpand(order._id)}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-gray-600 text-[12px]">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                  <div className="flex justify-between items-center">
                    <h2 className="text-md font-semibold">
                      Order ID:{" "}
                      <span className="text-sm font-normal text-gray-600">
                        {order._id.slice(-4)}
                      </span>
                    </h2>
                    <div className="flex flex-col items-center gap-1">
                      <p
                        style={{
                          color:
                            order.status === "Processing"
                              ? "orange"
                              : order.status === "Delivered"
                              ? "green"
                              : "#f7cd00",
                        }}
                      >
                        <span>{order.status} </span>
                      </p>

                      {order.deliveryBoyId ? (
                        <span className="bg-green-100 text-green-600 text-[12px] px-3 py-1 rounded-xl">
                          Delivery Alloted
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-600 text-[12px] px-3 py-1 rounded-xl">
                          Delivery Not Alloted
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-green-600">
                    ₹{order.amount.toFixed(2)}{" "}
                    <span className="text-gray-600">
                      [
                      {order.paymentMethod == "Online"
                        ? "Paid 😉"
                        : order.paymentMethod}
                      ]
                    </span>
                  </p>
                </div>

                {expandedOrderId === order._id && (
                  <div className="mt-4">
                    <p className="text-gray-600">
                      <strong>Status:</strong> {order.status}
                    </p>
                    <p className="text-gray-600">
                      <strong>Vendor:</strong> {order.vendorName}
                    </p>
                    <p className="text-gray-600">
                      <strong>Delivery Address:</strong>
                    </p>
                    <p className="text-gray-600 ml-4">
                      Hostel: {order.address.hostel}
                    </p>
                    <p className="text-gray-600 ml-4">
                      Campus: {order.address.campus}
                    </p>
                    <p className="text-gray-600 ml-4">
                      Phone Number: {order.address.phoneNumber}
                    </p>
                    <p className="text-gray-600">
                      <strong>Instructions:</strong>{" "}
                      {order.address.instructions}
                    </p>
                    <p className="text-gray-600">
                      <strong>Cutlery Quantity:</strong> {order.cutleryQuantity}
                    </p>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">
                        Products Ordered:
                      </h3>
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-800 text-white">
                            <th className="p-2 border border-gray-300">
                              Product Name
                            </th>
                            <th className="p-2 border border-gray-300">
                              Quantity
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(order.products).map((productName) => (
                            <tr key={productName}>
                              <td className="p-2 border border-gray-300">
                                {productName}
                              </td>
                              <td className="p-2 border border-gray-300 flex justify-center">
                                {order.products[productName].quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div
                      className="flex mt-2 gap-2 justify-center flex-col"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <div className="flex gap-3 items-center">
                        <div>
                          {!showCancelConfirmation ? (
                            <Button
                              className="bg-yellow-400 hover:bg-yellow-500"
                              onClick={() => setShowCancelConfirmation(true)}
                            >
                              Cancel Order
                            </Button>
                          ) : (
                            <div className="py-3">
                              <span>
                                Are you sure you want to cancel this order?
                              </span>

                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    handleOrderCancel(order._id);
                                    setShowCancelConfirmation(false);
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={() =>
                                    setShowCancelConfirmation(false)
                                  }
                                >
                                  No
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          {!showDeleteConfirmation ? (
                            <Button
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => setShowDeleteConfirmation(true)}
                            >
                              Permanently Delete
                            </Button>
                          ) : (
                            <div className="flex flex-col">
                              <span>
                                Are you sure you want to permanently delete this
                                order?
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    handleDeleteOrderClick(order._id);
                                    setShowDeleteConfirmation(false);
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={() =>
                                    setShowDeleteConfirmation(false)
                                  }
                                >
                                  No
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center flex-col gap-1 md:flex-row">
                        <Select
                          value={selectedDeliveryBoy}
                          onValueChange={(value) =>
                            setSelectedDeliveryBoy(value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Delivery Boy" />
                          </SelectTrigger>
                          <SelectContent>
                            {deliveryBoys.map((deliveryBoy) =>
                              deliveryBoy.isAvailable ? (
                                <SelectItem
                                  key={deliveryBoy._id}
                                  value={deliveryBoy._id}
                                >
                                  {deliveryBoy.name}
                                </SelectItem>
                              ) : null
                            )}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="secondary"
                          onClick={(e) =>
                            handleAssignDeliveryBoy(
                              order._id,
                              order.vendorName,
                              order.products,
                              order.address,
                              order.amount
                            )
                          }
                          disabled={!selectedDeliveryBoy.length}
                        >
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Downward arrow icon */}
                <div className="flex items-center text-gray-500 justify-center mt-2 scale-[0.8]">
                  View details
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default FoodOrderList;
