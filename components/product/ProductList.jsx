"use client";

import React from "react";
import { useRouter } from "next/navigation";

const ProductList = ({ products, currentFilter }) => {
  const router = useRouter();

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm overflow-scroll">
      <div className="font-semibold text-xl text-gray-800">
        {currentFilter ? "Accepted Products" : "Pending Products"}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="py-3 text-gray-600">Product ID</th>
              <th className="py-3 text-gray-600">Product Name</th>
              <th className="py-3 text-gray-600">Category</th>
              <th className="py-3 text-gray-600">MRP</th>
              <th className="py-3 text-gray-600">Cost Price</th>
              <th className="py-3 text-gray-600">Options</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="text-center py-2 whitespace-nowrap border-b border-gray-300 text-gray-700">
                  {product._id.slice(-5)}
                </td>
                <td className="text-center text-lg py-2 whitespace-nowrap border-b border-gray-300">
                  {product.productName}
                </td>
                <td className="text-center whitespace-nowrap border-b border-gray-300">
                  <span className="text-sm bg-gray-500 rounded-full px-2 py-1 text-white">
                    {product.category}
                  </span>
                </td>
                <td className="text-center py-2 whitespace-nowrap border-b border-gray-300 text-green-500">
                  ₹{product.pricing.mrp}
                </td>
                <td className="text-center py-2 whitespace-nowrap border-b border-gray-300 text-green-500">
                  ₹{product.pricing.costPrice}
                </td>
                <td className="text-center py-2 whitespace-nowrap border-b border-gray-300">
                  <button
                    onClick={() =>
                      router.push(`/product-approval/product-details?id=${product._id}`)
                    }
                    className="mx-1 bg-yellow-300 hover:bg-yellow-500 text-gray-800 text-sm py-2 px-2 rounded-full"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z" />
                      <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
