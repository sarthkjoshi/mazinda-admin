"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

const AvailableCategories = () => {
  const [categories, setcategories] = useState([]);

  const fetchCategories = async () => {
    const response = await axios.post("/api/category/fetch-categories");
    setcategories(response.data.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-5 rounded-xl">
      <h1 className="text-2xl font-semibold mb-2">Available Categories</h1>
      <div className="flex flex-wrap">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-gray-50 rounded-lg shadow-sm border p-4 hover:shadow-lg w-56 h-56 m-2 overflow-scroll"
          >
            <h2 className="text-2xl font-semibold mb-2 text-center">
              {category.categoryName}
            </h2>
            <ul className="list-disc ml-4">
              {category.subcategories.map((subcategory) => (
                <li
                  key={subcategory}
                  className="text-gray-600 text-sm list-none inline-block bg-gray-200 m-1 rounded-full py-1 px-2"
                >
                  {subcategory}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableCategories;
