"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import OvalLoader from "../utility/OvalLoader";

const OrdersList = ({ filter }) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const response = await axios.post("/api/order/fetch-all-orders", {
      filter: "all",
    });
    console.log(response.data.orders);
    setOrders(response.data.orders);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust options as needed
  };

  return (
    <div className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
      {!loading ? (
        <ol>
          {orders.length ? (
            orders.toReversed().map((order) => {
              return (
                <React.Fragment key={order._id}>
                  <li className="px-2 py-1 my-1 text-gray-600 text-sm">
                    <Link href={`/order?id=${order._id}`}>
                      <span className="text-[0.6em] text-gray-500 mr-3">
                        {formatTimestamp(order.createdAt)}
                      </span>
                      {order.cart.map((product) => {
                        console.log(product)
                        return (
                          <div key={product.productName}>
                            <span>{product.productName.slice(0, 25)}... </span>
                            <span className="text-md ml-3 font-bold">Rs {product.salesPrice} /-</span>
                          </div>
                        );
                      })}
                      <span>Status: <span className="text-green-500 font-bold">{order.status}</span></span>
                    </Link>
                  </li>
                  <hr />
                </React.Fragment>
              );
            })
          ) : (
            <span className="text-gray-500 text-sm">
              No {filter === "current" ? "Active" : "Previous"} Orders
            </span>
          )}
        </ol>
      ) : (
        <OvalLoader />
      )}
    </div>
  );
};

export default OrdersList;
