"use client";
import React, { useState } from "react";
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
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ViewBulkProduct from "./ViewBulkProduct";
// import EditProduct from "./EditProduct";

const BulkProductList = ({ products }) => {
  const [productsData, setProductsData] = useState(products);

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm overflow-scroll">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sub-Category</TableHead>
              <TableHead>MRP</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Sales Price</TableHead>
              <TableHead>View Details</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {productsData.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.productName.slice(0, 30)}...</TableCell>
                <TableCell>
                  <Badge variant={"secondary"}>{product.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={"secondary"}>{product.subcategory}</Badge>
                </TableCell>
                <TableCell>₹{product?.pricing?.mrp}</TableCell>
                <TableCell>₹{product?.pricing?.costPrice}</TableCell>
                <TableCell>₹{product?.pricing?.salesPrice}</TableCell>

                <TableCell>
                  <Drawer>
                    <DrawerTrigger>
                      <Button variant={"secondary"}>View Details</Button>
                    </DrawerTrigger>
                    <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[96%] ">
                      <DrawerHeader>
                        <DrawerTitle>Product Details</DrawerTitle>
                      </DrawerHeader>

                      <div className="overflow-auto">
                        <ViewBulkProduct productData={product} />
                      </div>
                    </DrawerContent>
                  </Drawer>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {productsData.length == 0 && (
          <div className="">
            <h4 className="text-center font-bold">No product found</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkProductList;
