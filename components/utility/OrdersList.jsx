"use client";

import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import OvalLoader from "./OvalLoader";
// import MagnifyingLoader from "../Loading-Spinners/MagnifyingLoader";

const OrdersList = ({ filter }) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setLoading(true);

    (async () => {
      const { data } = await axios.post("/api/order/fetch-all-orders", {
        filter: "all",
      });
      if (data.success) {
        setOrders(data.orders);
      } else {
        console.log("An error occurred" + data.error);
      }
    })();

    setLoading(false);
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
      {!loading ? (
        <ol>
          {orders.length ? (
            orders.map((order) => {
              return (
                <React.Fragment key={order._id}>
                  <li className="px-2 py-1 my-1 text-gray-600 text-sm">
                    <Link href={`/order?id=${order._id}`}>
                      <span className="text-[0.6em] text-gray-500 mr-3">
                        {formatTimestamp(order.createdAt)}
                      </span>
                      {order.cart.map((product) => {
                        return (
                          <div key={product.productName}>
                            • {product.productName.slice(0, 25)}...{"  "}
                            <span className="underline">
                              <b>₹{product.pricing.salesPrice}</b>
                            </span>
                          </div>
                        );
                      })}

                      <div className="mt-3 underline">
                        Order Total: <b> ₹{order.pricing.total_salesPrice}</b>
                      </div>
                      <span>
                        Status:{" "}
                        <span className="text-green-500 font-bold">
                          {order.status}
                        </span>
                      </span>
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
        // <MagnifyingLoader />
        <OvalLoader />
      )}
    </div>
  );
};

export default OrdersList;
