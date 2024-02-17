"use client";

import OvalLoader from "@/components/utility/OvalLoader";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Order = () => {
  const searchParams = useSearchParams();
  const order_id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [stores, setStores] = useState({});
  const [editableStatus, setEditableStatus] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/order/fetch-order-by-id", {
        id: order_id,
      });

      setOrder(data.order);
      setEditableStatus(data.order.status);
    } catch (err) {
      toast.info("Network Error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreDetails = async (storeId) => {
    try {
      const { data } = await axios.post("/api/store/fetch-store-by-id", {
        id: storeId,
      });

      if (data.success) {
        // Update the stores state with the fetched store details
        setStores((prevStores) => ({
          ...prevStores,
          [storeId]: data.store,
        }));
      }
    } catch (err) {
      toast.error("Failed to fetch store details");
      console.error(err);
    }
  };

  const handleStatusChange = async () => {
    try {
      // Send the updated status to the server
      await axios.post("/api/order/update-order-status", {
        id: order_id,
        status: editableStatus,
      });

      toast.success("Order status updated successfully");
    } catch (err) {
      toast.error("Failed to update order status");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(order).length) {
      (async () => {
        const { data } = await axios.post("/api/user/fetch-user-by-id", {
          id: order.userId,
        });

        if (data.success) {
          setUserInfo(data.user);
        }
      })();
    }

    // Fetch store details for each item in order.cart
    if (order?.cart?.length > 0) {
      order.cart.forEach((item) => {
        fetchStoreDetails(item.storeId);
      });
    }
  }, [order]);

  useEffect(() => {
    console.log(stores);
  }, [stores]);

  return (
    <div className="bg-white p-4 rounded-xl">
      <h1 className="text-2xl md:mb-10">Order Details</h1>
      {!loading ? (
        <>
          <div className="mt-3">
            {order.cart.length > 0 &&
              order.cart.map((item) => {
                return (
                  <div key={item._id}>
                    <div className="flex rounded-lg px-2 py-1 items-center mx-2 relative">
                      <img
                        className="w-14 h-auto"
                        src={item.imagePaths[0]}
                        alt="img"
                      />
                      <div className="flex flex-col ml-2">
                        <span className="text-sm">{item.productName}</span>
                        <div className="text-gray-600 font-semibold">
                          Rs {item.pricing.salesPrice}/-
                        </div>
                        <span className="text-gray-600 text-sm">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="text-gray-600 p-4">
                      {/* Store: {stores[item.storeId].storeName || "Loading..."} */}
                      <b> Store Name -</b> {stores[item.storeId]?.storeName}
                      <br />
                      <b>Store Contact-</b> {stores[item.storeId]?.mobileNumber}
                    </div>
                    <hr />
                  </div>
                );
              })}
          </div>

          <div className="p-3">
            <label className="font-bold">Live Order Status</label>
            <select
              value={editableStatus}
              onChange={(e) => setEditableStatus(e.target.value)}
              className="ml-2 p-2 border border-gray-300 rounded-md"
            >
              <option value="confirmed">Confirmed</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
            <button
              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md"
              onClick={handleStatusChange}
            >
              Update Status
            </button>
          </div>

          <hr />

          <div className="p-3">
            <h1 className="font-bold">Shipping Details</h1>
            <span className="text-sm text-gray-700">
              To - {order.address.name}
            </span>
            <br />
            <span className="text-sm text-gray-700">
              {order.address.subaddress}, {order.address.city}
            </span>
            <br />
            <span className="text-sm text-gray-700">
              {order.address.state}, {order.address.pincode}, IN
            </span>
            <br />
            <span className="text-sm text-gray-700 font-bold">
              Contact: {order.address.phone}
            </span>
          </div>

          <div className="p-3 mt-1">
            <span className="text-sm text-gray-600">
              Order ID: {order._id.slice(-5)}
            </span>
          </div>

          {userInfo && Object.keys(userInfo).length ? (
            <div className="p-3 mt-1">
              <h1 className="font-bold">User Details</h1>

              <div className="border rounded-sm p-2 mt-3">
                <span className="text-sm">Name: {userInfo.name}</span>
                <br />
                <span className="text-sm">Email: {userInfo.email}</span>
                <br />
                <span className="text-sm">Phone: {userInfo.phoneNumber}</span>
                <br />
              </div>
              <br />
            </div>
          ) : null}
          <hr />

          <div className="p-3">
            {/* <h1 className="font-bold">Invoice</h1> */}
            <div>
              <div className="flex justify-between font-bold text-lg">
                <span>Subtotal</span>
                <span>₹{order.pricing.total_mrp} /-</span>
              </div>
              <div className="flex justify-between text-green-500">
                <span>Discount</span>
                <span>
                  - ₹
                  {parseFloat(
                    order.pricing.total_mrp - order.pricing.total_salesPrice
                  )}{" "}
                  /-
                </span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge</span>
                <span>₹{order.pricing.service_charge} /-</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fees</span>
                <span>₹{order.pricing.delivery_fees} /-</span>
              </div>
              {order.pricing.coupon_discount ? (
                <div className="flex justify-between text-green-500">
                  <span>Coupon Discount</span>
                  <span>- ₹{order.pricing.coupon_discount} /-</span>
                </div>
              ) : null}
              <hr className="my-3" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  ₹
                  {order.pricing.coupon_discount
                    ? parseFloat(
                        order.pricing.total_salesPrice -
                          order.pricing?.coupon_discount
                      )
                    : parseFloat(order.pricing.total_salesPrice)}{" "}
                  /-
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center mt-5">
          <OvalLoader />
        </div>
      )}
    </div>
  );
};

export default Order;
