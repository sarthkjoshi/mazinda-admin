"use client";

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

const ProductList = ({ products }) => {
  const router = useRouter();

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
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product._id.slice(-5)}</TableCell>
                <TableCell>{product.productName.slice(0, 30)}...</TableCell>
                <TableCell>
                  <Badge variant={"outline"}>{product.category}</Badge>
                </TableCell>
                <TableCell>₹{product.pricing.mrp}</TableCell>
                <TableCell>₹{product.pricing.costPrice}</TableCell>
                <TableCell>₹{product.pricing.salesPrice}</TableCell>
                <TableCell>
                  <Button
                    variant={"secondary"}
                    onClick={() =>
                      router.push(
                        `/product-approval/product-details?id=${product._id}`
                      )
                    }
                  >
                    View / Edit
                  </Button>
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
