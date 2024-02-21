"use client";

import { useState, useEffect } from "react";
import ProductList from "@/components/product/ProductList";
import axios from "axios";
import OvalLoader from "@/components/utility/OvalLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductPage = () => {
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post("/api/product/fetch-all-products", {
          page: currentPage,
          pageSize: 50, // Adjust as needed
          approvalStatus: true
        });
        if (data.success) {
          setProducts(data.products);
        } else {
          console.error("An error occurred while fetching products");
        }
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setProductsLoading(false);
      }
    })();
  }, [currentPage]);

 
  const handlePageChange = async (newPage) => {
    try {
      setProductsLoading(true);
      const { data } = await axios.post("/api/product/fetch-all-products", {
        page: newPage,
        pageSize: 50,
        approvalStatus: true
      });

      if (data.success) {
        setProducts(data.products);
        setCurrentPage(newPage);
      } else {
        console.error("An error occurred while fetching products");
      }
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setProductsLoading(false);
    }
  };
  
  return (
    <>
      <h1 className="font-semibold text-3xl my-2">Approved Products</h1>
      <div className="w-full bg-white p-5 my-2 rounded-lg">
        {productsLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <OvalLoader />
          </div>
        ) : (
          <Tabs defaultValue="approved">
            <TabsList>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="pending"><a href="/product-approval">Pending</a></TabsTrigger>
            </TabsList>
            <TabsContent className="my-5" value="approved">

              <span>List of Pending Products</span>
              <div className="text-right">
                <button type="button"
                        variant="primary"
                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}>
                   Previous Page
                </button>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Page {currentPage}</span>
                <button 
                     type="button" 
                     className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                     onClick={() => handlePageChange(currentPage + 1)}
                    >
                    Next Page
                </button>
              </div>
              <ProductList
                products={products}
              />
              <div className="text-right">
                <button type="button"
                            variant="primary"
                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                   Previous Page
                </button>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Page {currentPage}</span>
                <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => handlePageChange(currentPage + 1)}>Next Page</button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default ProductPage;
