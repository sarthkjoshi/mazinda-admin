"use client";

import React, { useState } from "react";

const CouponsList = () => {
  const coupons = [
    {
      code: "SAVE20",
      type: "percentage",
      discount: 20,
      maxLimit: 50,
      minOrder: 100,
      category: "Electronics",
      status: true,
    },
    {
      code: "FLAT50",
      type: "rupee",
      discount: 50,
      maxLimit: 100,
      minOrder: 200,
      category: "Clothing",
      status: false,
    },
    {
      code: "SALE10",
      type: "percentage",
      discount: 10,
      maxLimit: 30,
      minOrder: 50,
      category: "Home Decor",
      status: true,
    },
  ];
  const [couponList, setCouponList] = useState(coupons);

  const handleToggleStatus = (index) => {
    const updatedList = [...couponList];
    updatedList[index].status = !updatedList[index].status;
    setCouponList(updatedList);
  };

  const handleDeleteCoupon = (index) => {
    const updatedList = [...couponList];
    updatedList.splice(index, 1);
    setCouponList(updatedList);
  };

  return (
    <div className="my-4 h-screen overflow-y-scroll">
      <table className="bg-white rounded-xl shadow-sm">
        <thead>
          <tr>
            <th className="p-3">Coupon Code</th>
            <th className="p-3">Type</th>
            <th className="p-3">Discount</th>
            <th className="p-3">Max Limit</th>
            <th className="p-3">Min Order</th>
            <th className="p-3">Category</th>
            <th className="p-3">Status</th>
            <th className="p-3">Options</th>
          </tr>
        </thead>
        <tbody>
          {couponList.map((coupon, index) => (
            <tr key={coupon.code}>
              <td className="p-3 text-orange-500">{coupon.code}</td>
              <td className="p-3">{coupon.type === "percentage" ? "%" : "₹"}</td>
              <td className="p-3">{coupon.discount}</td>
              <td className="p-3">{coupon.maxLimit}</td>
              <td className="p-3">{coupon.minOrder}</td>
              <td className="p-3">{coupon.category}</td>
              <td className="p-3">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={coupon.status}
                    onChange={() => handleToggleStatus(index)}
                  />
                  <span className="slider"></span>
                </label>
              </td>
              <td className="p-3">
                <button onClick={() => handleDeleteCoupon(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponsList;