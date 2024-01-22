"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Switch } from "@/components/ui/switch";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";
import { Badge } from "../ui/badge";

const CouponsList = () => {
  const [coupons, setCoupons] = useState([]);

  const handleToggleStatus = (index) => {
    const updatedList = [...coupons];
    updatedList[index].status = !updatedList[index].status;
    setCoupons(updatedList);
  };

  const handleDeleteCoupon = (index) => {
    const updatedList = [...coupons];
    updatedList.splice(index, 1);
    setCoupons(updatedList);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post("/api/coupon/fetch-all-coupons");
        if (data.success) {
          console.log(data.coupons);
          setCoupons(data.coupons);
        } else {
          toast("An error occurred while fetching coupons");
        }
      } catch (err) {
        toast("Oops, a network error occurred while fetching coupons", err);
      }
    })();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Max Limit</TableHead>
            <TableHead>Min Order</TableHead>
            <TableHead>Usage Limit</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Cities</TableHead>
            <TableHead>Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon, index) => (
            <TableRow key={index}>
              <TableCell className="text-gray-500 font-extrabold">
                {coupon.code}
              </TableCell>
              <TableCell>
                {coupon.discountType === "percentage"
                  ? `${coupon.discount}%`
                  : `₹ ${coupon.discount}`}
              </TableCell>
              <TableCell>{coupon.discountOn}</TableCell>
              <TableCell>
                {coupon.discountType === "percentage"
                  ? `₹ ${coupon.maxLimit}`
                  : ""}
              </TableCell>
              <TableCell>₹ {coupon.minOrder}</TableCell>
              <TableCell>{coupon.usageLimit}</TableCell>

              <TableCell>
                <div className="flex flex-col gap-1">
                  {coupon.categories.map((category) => (
                    <Badge key={category} variant={"secondary"}>
                      {category}
                    </Badge>
                  ))}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1">
                  {coupon.cities.map((city) => (
                    <Badge key={city} variant={"secondary"}>
                      {city}
                    </Badge>
                  ))}
                </div>
              </TableCell>

              <TableCell>
                <Switch className="scale-75" checked={coupon.isActive} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CouponsList;
