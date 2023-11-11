"use client";

import React, { useState, useEffect } from 'react';
import ProductList from '@/components/product/ProductList';
import axios from 'axios';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(true); 

  const fetchProducts = async () => {
    try {
      const response = await axios.post("/api/product/fetch-all-products");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        console.error("An error occurred while fetching products");
      }
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <h1 className="font-semibold text-3xl my-2">Product Page</h1>
      <div className="my-2">
        <div className="w-full bg-white py-4">
          <ul className="flex">
            <li
              className={`border border-gray-400 rounded-lg mx-3 px-2 py-1 hover:bg-gray-300 hover:cursor-pointer ${currentFilter ? "bg-gray-300" : ""}`}
              onClick={() => setCurrentFilter(true)} 
            >
              Accepted
            </li>
            <li
              className={`border border-gray-400 rounded-lg mx-3 px-2 py-1 hover:bg-gray-300 hover:cursor-pointer ${!currentFilter ? "bg-gray-300" : ""}`}
              onClick={() => setCurrentFilter(false)} 
            >
              Pending
            </li>
          </ul>
        </div>
        <ProductList products={products.filter(product => product.approvalStatus === currentFilter)} currentFilter={currentFilter} />
      </div>
    </>
  );
};

export default ProductPage;
