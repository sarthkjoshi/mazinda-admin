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

const ProductList = ({ products }) => {
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [productsData, setProductsData] = useState(products);

  const handleCheckboxChange = async (event, productId, propertyName) => {
    try {
      const { data } = await axios.put("/api/product/update-trending-deal", {
        productId: productId,
        propertyName: propertyName,
        propertyValue: event.target.checked,
      });

      if (data.success) {
        const updatedProducts = productsData.map((product) => {
          if (product._id === productId) {
            return {
              ...product,
              [propertyName]: !event.target.checked,
            };
          }
          return product;
        });
        setProductsData(updatedProducts);
        toast.success(data.message, { autoClose: 3000 });
      } else {
        toast.error(data.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error saving product data: ", error);
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
              <TableHead>Category</TableHead>
              <TableHead>MRP</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Sales Price</TableHead>
              <TableHead>Top Deal</TableHead>
              <TableHead>Trending</TableHead>
              <TableHead>Options</TableHead>
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
                <TableCell>₹{product?.pricing?.mrp}</TableCell>
                <TableCell>₹{product?.pricing?.costPrice}</TableCell>
                <TableCell>₹{product?.pricing?.salesPrice}</TableCell>
                <TableCell>
                  <input
                    checked={product.topDeal}
                    onChange={(e) =>
                      handleCheckboxChange(e, product._id, "topDeal")
                    }
                    type="checkbox"
                    className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </TableCell>
                <TableCell>
                  <input
                    checked={product.trending}
                    onChange={(e) =>
                      handleCheckboxChange(e, product._id, "trending")
                    }
                    className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    type="checkbox"
                  />
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
                    <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[96%] overflow-auto">
                      <DrawerHeader>
                        <DrawerTitle>Product Details</DrawerTitle>
                      </DrawerHeader>

                      <EditProduct id={product._id} />
                    </DrawerContent>
                  </Drawer>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductList;
