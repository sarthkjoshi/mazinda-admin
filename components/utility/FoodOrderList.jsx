// "use client";

// import axios from "axios";
// import Cookies from "js-cookie";
// import React, { useEffect, useState } from "react";

// // import MagnifyingLoader from "../Loading-Spinners/MagnifyingLoader";
// import OvalLoader from "./OvalLoader";

// const FoodOrdersList = ({ filter }) => {
//   const [loading, setLoading] = useState(true);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     setLoading(true);

//     const fetchData = async () => {
//       try {
//         const { data } = await axios.post("/api/order/fetch-food-orders");
//         if (data.success) {
//           setOrders(data.food_orders.reverse());
//         } else {
//           console.log("An error occurred" + data.error);
//         }
//       } catch (error) {
//         console.error("Error fetching or updating data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     const intervalId = setInterval(fetchData, 20000);
//     return () => clearInterval(intervalId);
//   }, []);

//   var filteredOrders = [];
//   if (filter == "active") {
//     filteredOrders = orders.filter(
//       (order) => order.status.toLowerCase() !== "delivered"
//     );
//   } else {
//     filteredOrders = orders.filter(
//       (order) => order.status.toLowerCase() === "delivered"
//     );
//   }

//   return (
//     <div className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
//       {!loading ? (
//         <ol>
//           {filteredOrders.length ? (
//             filteredOrders.toReversed().map((order) => {
//               return (
//                 <React.Fragment key={order._id}>
//                   <li className="px-2 py-1 my-1 text-gray-600 text-sm">
//                     <div>
//                       <p
//                         className="font-bold text-gray-700 mr-3"
//                         style={{
//                           // color: order.status === "delivered" ? "black" : "#83d429",
//                           color:
//                             order.status === "processing"
//                               ? "orange"
//                               : order.status == "delivered"
//                               ? "green"
//                               : "#f7cd00",
//                           fontWeight: 500,
//                         }}
//                       >
//                         {order.status === "out_for_delivery"
//                           ? "OUT FOR DELIVERY".toUpperCase()
//                           : order.status === "delivered"
//                           ? "DELIVERED"
//                           : order.status.toUpperCase()}
//                       </p>

//                       {Object.keys(order.products).map((productName) => (
//                         <p
//                           className="font-bold mt-2"
//                           style={{
//                             fontSize: 14,
//                             color: "#525156",
//                           }}
//                         >
//                           {order.products[productName].quantity} x {productName}
//                         </p>
//                       ))}

//                       <div
//                         className="flex"
//                         style={{
//                           flexDirection: "row",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           marginTop: 12,
//                         }}
//                       >
//                         <span
//                           style={{
//                             color: "gray",
//                           }}
//                         >
//                           {new Date(order.createdAt).toLocaleString("en-US", {
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                             hour12: true,
//                           })}
//                         </span>
//                         <span
//                           style={{
//                             fontSize: 17,
//                             fontWeight: "bold",
//                           }}
//                         >
//                           ₹{order.amount} /-
//                         </span>
//                       </div>
//                     </div>
//                   </li>
//                   <hr />
//                 </React.Fragment>
//               );
//             })
//           ) : (
//             <span className="text-gray-500 text-sm">
//               No {filter === "current" ? "Active" : "Previous"} Orders
//             </span>
//           )}
//         </ol>
//       ) : (
//         <OvalLoader />
//       )}
//     </div>
//   );
// };

// export default FoodOrdersList;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import OvalLoader from "./OvalLoader";

const MyOrdersPage = () => {
  const router = useRouter();
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

  const fetchVendor = async (vendorId) => {
    const { data } = await axios.post(
      `https://citikartt.com/api/vendor/fetchvendorbyid`,
      {
        _id: vendorId,
      }
    );
    return data;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.post(`/api/food/order/fetch`, {
          page,
          perPage: 10,
        });
        console.log(data);
        const newOrders = data.food_orders;

        if (newOrders.length < 10) {
          setHasMore(false);
        }

        // Update orders with vendor names
        const ordersWithVendors = await Promise.all(
          newOrders.map(async (order) => {
            const vendorInfo = await fetchVendor(order.vendorId);
            return {
              ...order,
              vendorName: vendorInfo.vendor.name,
              deliveryCharges: vendorInfo.vendor.deliveryCharges,
            };
          })
        );

        if (page === 1) {
          // If this is the initial fetch, set orders
          setOrders(ordersWithVendors);
        } else {
          // If this is not the initial fetch, append to orders
          setOrders((prevOrders) => prevOrders.concat(ordersWithVendors));
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router, page]); // Include router as a dependency

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
    const response = await axios.put("/api/admin/set-all-orders-delivered");
    console.log(response.data);
    if (response.data.success) {
      toast.success(
        'All orders with "Processing" or "Out for delivery" set to "Delivered"'
      );
    }
    setAllDeliveredButtonLoading(false);
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <div className="flex gap-2 mb-2">
        <button
          onClick={downloadCSV}
          className="bg-black hover:opacity-75 text-white py-2 px-4 rounded"
        >
          Export Orders Data
        </button>
        <button
          onClick={handleAllDeliveredClick}
          className="bg-green-500 hover:opacity-75 text-white py-2 px-4 rounded"
        >
          {allDeliveredButtonLoading ? <OvalLoader /> : "Set Delivered"}
        </button>
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
                className="bg-white shadow border rounded-lg mb-6 px-4 pt-4 pb-1 cursor-pointer w-1/2"
                onClick={() => toggleExpand(order._id)}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-gray-600 text-[12px]">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                  <div className="flex justify-between">
                    <h2 className="text-md font-semibold">
                      Order ID:{" "}
                      <span className="text-sm font-normal text-gray-600">
                        {order._id.slice(-4)}
                      </span>
                    </h2>
                    {/* <h2 className="text-md font-semibold">
                    Full Order ID :{" "}
                    <span className="text-sm font-normal text-gray-600">
                      {order._id}
                    </span>
                  </h2> */}
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
                      <strong>User:</strong>{" "}
                      {order.userName ? order.userName : ""}
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
                      className="flex mt-2"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <div>
                        {!showCancelConfirmation && (
                          <button
                            className="text-sm bg-yellow-300 text-yellow-700 p-2 m-2 rounded-md shadow"
                            onClick={() => setShowCancelConfirmation(true)}
                          >
                            Cancel Order
                          </button>
                        )}

                        {showCancelConfirmation && (
                          <div>
                            <span>
                              Are you sure you want to cancel this order
                            </span>
                            <button
                              className="bg-gray-500 px-2 py-1 rounded-md text-white text-sm mx-1"
                              onClick={() => {
                                handleOrderCancel(order._id);
                                setShowCancelConfirmation(false);
                              }}
                            >
                              Yes
                            </button>
                            <button
                              className="bg-gray-500 px-2 py-1 rounded-md text-white text-sm mx-1"
                              onClick={() => setShowCancelConfirmation(false)}
                            >
                              No
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        {!showDeleteConfirmation && (
                          <button
                            className="text-sm bg-red-500 text-white p-2 m-2 rounded-md shadow"
                            onClick={() => setShowDeleteConfirmation(true)}
                          >
                            Permanently Delete
                          </button>
                        )}

                        {showDeleteConfirmation && (
                          <div>
                            <span>
                              Are you sure you want to permanently delete this
                              order?
                            </span>
                            <button
                              className="bg-gray-500 px-2 py-1 rounded-md text-white text-sm mx-1"
                              onClick={() => {
                                handleDeleteOrderClick(order._id);
                                setShowDeleteConfirmation(false);
                              }}
                            >
                              Yes
                            </button>
                            <button
                              className="bg-gray-500 px-2 py-1 rounded-md text-white text-sm mx-1"
                              onClick={() => setShowDeleteConfirmation(false)}
                            >
                              No
                            </button>
                          </div>
                        )}
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

export default MyOrdersPage;
