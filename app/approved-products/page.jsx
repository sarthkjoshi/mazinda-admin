"use client";

import { useState, useEffect } from "react";
import ProductList from "@/components/product/ProductList";
import axios from "axios";
import Link from "next/link";
import OvalLoader from "@/components/utility/OvalLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ProductPage = () => {
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleVendorChange = async (vendor) => {
    setSelectedVendor(vendor);
    try {
      setProductsLoading(true);
      const { data } = await axios.post("/api/product/fetch-all-products", {
        page: 1,
        pageSize: 50,
        approvalStatus: true,
        selectedVendor: vendor,
        selectedCategory: selectedCategory,
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
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    try {
      setProductsLoading(true);
      const { data } = await axios.post("/api/product/fetch-all-products", {
        page: 1,
        pageSize: 50,
        approvalStatus: true,
        selectedCategory: category,
        selectedVendor: selectedVendor,
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
  };

  const fetchStores = async () => {
    try {
      const { data } = await axios.post(
        "/api/add-drop-stores/fetch-all-stores"
      );
      if (data.success) {
        setStores(data.stores);
      } else {
        return "An error occurred";
      }
    } catch (error) {
      console.error("Error fetching stores: ", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.post("/api/category/fetch-categories");
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching stores: ", error);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchCategories();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post("/api/product/fetch-all-products", {
          page: currentPage,
          pageSize: 50, // Adjust as needed
          approvalStatus: true,
          selectedVendor: selectedVendor,
          selectedCategory: selectedCategory,
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
        approvalStatus: true,
        selectedVendor: selectedVendor,
        selectedCategory: selectedCategory,
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
              <TabsTrigger value="pending">
                <Link href="/product-approval">Pending</Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent className="my-5" value="approved">
              <div className="flex justify-between items-center">
                <div className="flex items-center justify-center gap-2">
                  <Label htmlFor="category-filter" className="font-bold">
                    Filter by Vendor
                  </Label>
                  <Select
                    id="vendor-filter"
                    value={selectedVendor}
                    onValueChange={(value) => handleVendorChange(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store._id} value={store._id}>
                          {store.storeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Label htmlFor="category-filter" className="font-bold">
                    Filter by Category
                  </Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => handleCategoryFilter(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.categoryName}
                          value={category.categoryName}
                        >
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {products.length > 0 ? (
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button variant="outline">{currentPage}</Button>
                    <Button
                      variant="secondary"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>

              <ProductList products={products} />
              {products.length > 0 ? (
                <div className="text-right">
                  <button
                    type="button"
                    variant="primary"
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous Page
                  </button>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                    Page {currentPage}
                  </span>
                  <button
                    type="button"
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next Page
                  </button>
                </div>
              ) : (
                <div></div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default ProductPage;
