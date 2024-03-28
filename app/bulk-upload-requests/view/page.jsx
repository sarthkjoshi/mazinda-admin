"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import BulkProductList from "@/components/product/BulkProductsList";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import OvalLoader from "@/components/utility/OvalLoader";

const ViewRequest = () => {
  const searchParams = useSearchParams();
  const request_id = searchParams.get("request_id");

  const [products, setProducts] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);
  const [edited, setEdited] = useState(false);

  const handleApprove = async () => {
    setApproveLoading(true);
    let counter = 0;
    for (let product of products) {
      try {
        const { data } = await axios.post("/api/product/add", {
          productData: {
            productName: product.productName,
            storeId: request_id,
            category: product.category,
            subcategory: product.subcategory,
            imagePaths: [product.imagePaths],
            pricing: {
              mrp: product.mrp,
              costPrice: product.costPrice,
              salesPrice: product.salesPrice,
            },
            description: [
              {
                description: product.description,
                descriptionHeading: product.descriptionHeading,
              },
            ],
            tags: [product.tags],
          },
        });

        if (data.success) {
          counter += 1;
        } else {
          console.log("product failed to add");
        }
      } catch (e) {
        toast.error("A product failed to add" + e);
      }
    }
    // toast.success(`${counter} products added successfully`);
    setApproveLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data } = await axios.post("/api/bulk-upload/fetch-request", {
        request_id,
      });
      if (data.success) {
        setDate(data.bulk_upload_request.createdAt);
        setProducts(data.bulk_upload_request.requestProducts);
      } else {
        console.log("An error occurred");
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-5 flex items-center justify-center">
        <OvalLoader />
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded-md flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-lg">{products.storeName}</span>
          <span className="text-sm text-gray-500">
            {new Date(date).toLocaleString()}
          </span>
        </div>
        {approveLoading ? (
          <Button className="bg-green-400" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Approving
          </Button>
        ) : (
          <div className="flex gap-3">
            {edited && (
              <span className="bg-yellow-500 text-white px-2 py-2 rounded-md text-sm">
                Edited
              </span>
            )}
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={handleApprove}
            >
              Approve
            </Button>
          </div>
        )}
      </div>

      <div>
        {products.length ? <BulkProductList products={products} /> : null}
      </div>
    </div>
  );
};

export default ViewRequest;
