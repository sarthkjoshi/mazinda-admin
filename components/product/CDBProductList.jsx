"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import CDBEditProduct from "./CDBEditProduct";

const CBDProductList = ({ products }) => {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productsData, setProductsData] = useState(
    products.map((product) => ({
      ...product,
      mrp: product?.pricing?.mrp,
      costPrice: product?.pricing?.costPrice,
      salesPrice: product?.pricing?.salesPrice,
    }))
  );

  const handleSave = async (productId) => {
    try {
      const product = productsData.find((p) => p._id === productId);
      await axios.put(`/api/cdb/update-price/`, {
        pricing: {
          mrp: product.mrp,
          costPrice: product.costPrice,
          salesPrice: product.salesPrice,
        },
        id: productId,
      });
      toast.success("Product updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm overflow-scroll">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>MRP</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Sales Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsData.map((product) => (
              <TableRow
                key={product._id}
                className={
                  selectedProductId && selectedProductId === product._id
                    ? "bg-yellow-300 hover:bg-yellow-200"
                    : ""
                }
              >
                <TableCell>{product._id.slice(-5)}</TableCell>
                <TableCell>{product.productName.slice(0, 30)}...</TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={product.mrp}
                    onChange={(e) => {
                      const updatedProducts = productsData.map((p) =>
                        p._id === product._id
                          ? { ...p, mrp: e.target.value.replace(/[^0-9]/g, "") }
                          : p
                      );
                      setProductsData(updatedProducts);
                    }}
                    onBlur={() => handleSave(product._id)}
                    pattern="[0-9]*"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={product.costPrice}
                    onChange={(e) => {
                      const updatedProducts = productsData.map((p) =>
                        p._id === product._id
                          ? {
                              ...p,
                              costPrice: e.target.value.replace(/[^0-9]/g, ""),
                            }
                          : p
                      );
                      setProductsData(updatedProducts);
                    }}
                    onBlur={() => handleSave(product._id)}
                    pattern="[0-9]*"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={product.salesPrice}
                    onChange={(e) => {
                      const updatedProducts = productsData.map((p) =>
                        p._id === product._id
                          ? {
                              ...p,
                              salesPrice: e.target.value.replace(/[^0-9]/g, ""),
                            }
                          : p
                      );
                      setProductsData(updatedProducts);
                    }}
                    onBlur={() => handleSave(product._id)}
                    pattern="[0-9]*"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                  />
                </TableCell>
                <TableCell>
                  <Drawer>
                    <DrawerTrigger>
                      <Button
                        onClick={() => setSelectedProductId(product._id)}
                        variant={"secondary"}
                      >
                        View
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[96%]">
                      <DrawerHeader>
                        <DrawerTitle>Product Details</DrawerTitle>
                      </DrawerHeader>
                      <div className="overflow-auto">
                        <CDBEditProduct id={product._id} />
                      </div>
                    </DrawerContent>
                  </Drawer>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {productsData.length === 0 && (
          <div className="">
            <h4 className="text-center font-bold">No product found</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default CBDProductList;
