"use client";

import { useState, useEffect } from "react";
import ProductList from "@/components/product/ProductList";
import axios from "axios";
import OvalLoader from "@/components/utility/OvalLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import CBDProductList from "@/components/product/CDBProductList";

const ProductPage = () => {
  const router = useRouter();
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [CDBProducts, setCDBProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const approval_status =
    useSearchParams().get("approval-status") || "approved";

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
      const response = await axios.post(
        "/api/add-drop-stores/fetch-all-stores"
      ); // Replace with your API endpoint
      if (response.data.success) {
        setStores(response.data.stores);
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
    setProductsLoading(true);
    (async () => {
      try {
        const { data } = await axios.post("/api/product/fetch-all-products", {
          page: currentPage,
          pageSize: 50, // Adjust as needed
          approvalStatus: approval_status === "approved",
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
  }, [currentPage, approval_status]);

  useEffect(() => {
    async function getCBDProd() {
      try {
        const { data } = await axios.post("/api/cdb/fetch-all-products", {
          page: 1,
          pageSize: 50,
        });
        if (data.success) {
          setCDBProducts(data.products);
          setCurrentPage(data.currentPage);
        } else {
          console.log("error", data.message);
        }
      } catch (error) {
        console.error("Error fetching CBD products:", error);
      }
    }
    getCBDProd();
  }, []);

  const handlePageChange = async (newPage) => {
    try {
      setProductsLoading(true);
      const { data } = await axios.post("/api/product/fetch-all-products", {
        page: newPage,
        pageSize: 50,
        approvalStatus: approval_status === "approved",
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

    try {
      const { data } = await axios.post("/api/cdb/fetch-all-products", {
        page: newPage,
        pageSize: 50,
      });
      if (data.success) {
        setCDBProducts(data.products);
      } else {
        console.log("error", data.message);
      }
    } catch (error) {
      console.error("Error fetching CBD products: ", error);
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-3xl my-2">Product Management</h1>
        <Link href={"/central-database"}>
          <Button>Manage Central Database</Button>
        </Link>
      </div>
      <div className="w-full bg-white p-5 my-2 rounded-lg">
        {productsLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <OvalLoader />
          </div>
        ) : (
          <Tabs defaultValue={approval_status}>
            <TabsList>
              <TabsTrigger
                value="approved"
                onClick={() => router.push("?approval-status=approved")}
              >
                Approved
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                onClick={() => router.push("?approval-status=pending")}
              >
                Pending
              </TabsTrigger>{" "}
              <TabsTrigger
                value="pre-approved"
                onClick={() => router.push("?approval-status=pre-approved")}
              >
                Pre-approved
              </TabsTrigger>{" "}
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
                <div className="flex gap-1 justify-center mt-5">
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
            </TabsContent>
            <TabsContent className="my-5" value="pending">
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
                <div className="flex gap-1 justify-center mt-5">
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
            </TabsContent>
            <TabsContent className="my-5" value="pre-approved">
              <div className="flex justify-between items-center">
                {CDBProducts.length > 0 ? (
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

              <CBDProductList products={CDBProducts} />
              {CDBProducts.length > 0 ? (
                <div className="flex gap-1 justify-center mt-5">
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
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default ProductPage;
