"use client";

import { useState, useEffect } from "react";
import ProductList from "@/components/product/ProductList";
import axios from "axios";
import OvalLoader from "@/components/utility/OvalLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductPage = () => {
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post("/api/product/fetch-all-products");
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
  }, []);

  return (
    <>
      <h1 className="font-semibold text-3xl my-2">Product Page</h1>
      <div className="w-full bg-white p-5 my-2 rounded-lg">
        {productsLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <OvalLoader />
          </div>
        ) : (
          <Tabs defaultValue="approved">
            <TabsList>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <TabsContent className="my-5" value="approved">
              <span>List of Approved Products</span>
              <ProductList
                products={products.filter((product) => product.approvalStatus)}
              />
            </TabsContent>
            <TabsContent value="pending">
              <span>List of Pending Products</span>
              <ProductList
                products={products.filter((product) => !product.approvalStatus)}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default ProductPage;
