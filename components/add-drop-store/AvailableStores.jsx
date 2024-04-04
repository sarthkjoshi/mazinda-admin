"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

const AvailableStores = ({ stores, filter }) => {
  if (!stores.length) {
    return (
      <div className="pt-7 pb-5">
        <span className="text-gray-500">No {filter} stores </span>
      </div>
    );
  }
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm overflow-scroll">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Store Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store, index) => (
            <TableRow key={index}>
              <TableCell>{store._id.slice(-5)}</TableCell>
              <TableCell>{store.storeName}</TableCell>
              <TableCell>
                {store.storeAddress?.address}, {store.storeAddress?.city}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/store-details?id=${store._id}`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AvailableStores;
