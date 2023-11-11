'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import OvalLoader from "@/components/utility/OvalLoader";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchCategories = async () => {
    try {
      const response = await axios.post("/api/category/fetch-categories");
      const fetchedCategories = response.data.categories;
      setCategories(fetchedCategories);
      setLoadingCategories(false); // Set loading state to false
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoadingCategories(false); // Set loading state to false even on error
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.post("/api/product/fetch-product-by-id", {
        id,
      });
      if (response.data.success) {
        setProductData(response.data.product);
        setLoading(false);
      } else {
        console.error("Error while fetching the product");
      }
    } catch (error) {
      console.error("Error fetching product data: ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    try {
      const response = await axios.put("/api/product/update-product", {
        productData,
      });
      if (response.data.success) {
        toast.success(response.data.message, { autoClose: 3000 });
      } else {
        toast.error(response.data.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error saving product data: ", error);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Handle nested objects like pricing
    if (name.includes(".")) {
      const [fieldName, nestedField] = name.split(".");
      setProductData({
        ...productData,
        [fieldName]: {
          ...productData[fieldName],
          [nestedField]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      // Update the productData object with the edited value
      setProductData({
        ...productData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Define a function to get subcategories for a selected category
  const getSubcategories = (selectedCategory) => {
    // Find the selected category in the categories data
    const selectedCategoryData = categories.find(
      (category) => category.categoryName === selectedCategory
    );
    return selectedCategoryData ? selectedCategoryData.subcategories : [];
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-sm rounded-xl">
      <h1 className="text-3xl font-semibold mb-4">Product Details</h1>
      {loading ? (
        <OvalLoader />
      ) : (
        <>
          {isEditing ? (
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">Product Name:</label>
                  <input
                    type="text"
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold">
                    Approved Status:
                  </label>
                  <select
                    name="approvalStatus"
                    value={productData.approvalStatus}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 ${productData.approvalStatus ? "bg-green-300" : "bg-yellow-300"}`}
                  >
                    <option value={true}>Approved</option>
                    <option value={false}>Pending</option>
                  </select>
                </div>
                
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold">MRP:</label>
                  <input
                    type="text"
                    name="pricing.mrp"
                    value={productData.pricing.mrp}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Cost Price:</label>
                  <input
                    type="text"
                    name="pricing.costPrice"
                    value={productData.pricing.costPrice}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Sales Price:</label>
                  <input
                    type="text"
                    name="pricing.salesPrice"
                    value={productData.pricing.salesPrice}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              {/* Show subcategories based on the selected category */}
              {productData.category && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                  <label className="block font-semibold">Category:</label>
                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category.categoryName}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                  <div>
                    <label className="block font-semibold">Subcategory:</label>
                    <select
                      name="subcategory"
                      value={productData.subcategory}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    >
                      {getSubcategories(productData.category).map(
                        (subcategory) => (
                          <option key={subcategory} value={subcategory}>
                            {subcategory}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              )}
              {/* <div className="grid grid-cols-2 gap-4"> */}
                
              {/* </div> */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">Trending:</label>
                  <input
                    type="checkbox"
                    name="trending"
                    checked={productData.trending}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Top Deal:</label>
                  <input
                    type="checkbox"
                    name="topDeal"
                    checked={productData.topDeal}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="flex justify-between">
              <div>
                <div>
                  <div>
                    {productData.approvalStatus ? (
                      <p className="text-lg my-2 bg-green-200 px-3 py-1 rounded-full w-fit text-green-800">
                        Approved
                      </p>
                    ) : (
                      <p className="text-lg my-2 bg-yellow-200 px-3 py-1 rounded-full w-fit text-yellow-500">
                        Pending
                      </p>
                    )}
                  </div>
                  <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                    Product Name:
                  </p>
                  <p className="inline-block mx-2 text-lg">
                    {productData.productName}
                  </p>
                </div>
                <div>
                  <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                    Category:
                  </p>
                  <p className="inline-block mx-2 text-lg">
                    {productData.category}
                  </p>
                </div>
                <div>
                  <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                    Subcategory:
                  </p>
                  <p className="inline-block mx-2 text-lg">
                    {productData.subcategory}
                  </p>
                </div>
                <div>
                  <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                    MRP:
                  </p>
                  <p className="inline-block mx-2 text-lg">
                    {productData.pricing.mrp}
                  </p>
                </div>
                <div>
                  <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                    Cost Price:
                  </p>
                  <p className="inline-block mx-2 text-lg">
                    {productData.pricing.costPrice}
                  </p>
                </div>
                <div>
                  <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                    Sales Price:
                  </p>
                  <p className="inline-block mx-2 text-lg">
                    {productData.pricing.salesPrice}
                  </p>
                </div>
                <div>
                  <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                    Trending:
                  </p>
                  <p className="inline-block mx-2 text-lg">
                    {productData.trending ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="inline-block mx-2 my-3 font-semibold w-[240px] text-lg">
                    Top Deal:
                  </p>
                  <p className="inline-block mx-2 text-lg">
                    {productData.topDeal ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="self-center">
                <img
                  className="w-80 rounded-lg"
                  src={productData.imagePaths[0]}
                  alt={productData.name}
                />
              </div>
            </div>
          )}

          {isEditing ? (
            <div className="flex">
            <button
              onClick={handleSaveClick}
              className="bg-[#fb691e] my-2 text-white px-4 py-2 rounded-md hover:opacity-70 focus:outline-none"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="mx-3 border border-[#fb691e] my-2 text-[#fb691e] px-4 py-2 rounded-md hover:opacity-70 focus:outline-none"
            >
              Cancel
            </button>
            </div>
          ) : (
            <button
              onClick={handleEditClick}
              className="bg-[#fb691e] my-5 text-white px-10 py-2 rounded-md hover:opacity-70 focus:outline-none"
            >
              Edit
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetails;