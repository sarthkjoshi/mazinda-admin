"use client";

import { useState } from "react";

const CreateCoupon = () => {
  const initialCouponState = {
    code: "",
    type: "percentage",
    discount: "",
    maxLimit: "",
    minOrder: "",
    category: "",
    description: "",
  };

  const [coupon, setCoupon] = useState(initialCouponState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoupon({ ...coupon, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here, you can add code to handle the submission of the coupon data,
    // such as sending it to a server or updating a list of coupons.
    console.log("Coupon data submitted:", coupon);
    // Reset the form after submission
    setCoupon(initialCouponState);
  };

  return (
    <div className="bg-white rounded-xl p-4 mt-2">
      <h2 className="text-xl mb-4 font-semibold text-center">Create Coupon</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <input
            type="text"
            id="code"
            name="code"
            placeholder="Coupon Code"
            value={coupon.code}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="flex justify-between">
          <div className="mb-4">
            <input
              type="number"
              id="discount"
              name="discount"
              placeholder="Discount"
              value={coupon.discount}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4  ml-2">
            <select
              id="type"
              name="type"
              value={coupon.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="percentage">Percentage</option>
              <option value="rupee">Rupee</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="mb-4">
            <input
              type="number"
              id="maxLimit"
              name="maxLimit"
              placeholder="Max Limit"
              value={coupon.maxLimit}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4 ml-2">
            <input
              type="number"
              id="minOrder"
              name="minOrder"
              placeholder="Min Order"
              value={coupon.minOrder}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="category"
            name="category"
            placeholder="Category"
            value={coupon.category}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <textarea
            type="text"
            id="description"
            name="description"
            placeholder="Description"
            value={coupon.description}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4 flex justify-center items-center">
          <button
            type="submit"
            className="bg-[#f96b1d] text-white font-semibold py-2 px-4 rounded-full"
          >
            Add Coupon
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupon;
