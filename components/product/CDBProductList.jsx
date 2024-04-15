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
import EditProduct from "./EditProduct";

const CBDProductList = ({ products }) => {
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [productsData, setProductsData] = useState(products);

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm overflow-scroll">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
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
                  <Badge variant={"secondary"}>{product.category}</Badge>
                </TableCell>

                <TableCell>
                  <Drawer>
                    <DrawerTrigger>
                      <Button
                        onClick={() => setSelectedProductId(product._id)}
                        variant={"secondary"}
                      >
                        View / Edit
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[96%] ">
                      <DrawerHeader>
                        <DrawerTitle>Product Details</DrawerTitle>
                      </DrawerHeader>

                      <div className="overflow-auto">
                        <EditProduct id={product._id} />
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

export default CBDProductList;
