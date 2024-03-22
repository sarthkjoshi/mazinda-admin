"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import BulkProductList from "@/components/product/BulkProductsList";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Readable } from "stream";
import csv from "csv-parser";

const ViewRequest = () => {
  const searchParams = useSearchParams();
  const request_id = searchParams.get("request_id");

  const [request, setRequest] = useState({});
  const [products, setProducts] = useState([]);

  const [approveLoading, setApproveLoading] = useState(false);

  function parseCSV(csvData, callback) {
    const stream = new Readable();
    stream.push(csvData);
    stream.push(null); // Signals the end of the stream
    let records = [];

    stream
      .pipe(csv())
      .on("data", (data) => records.push(data))
      .on("end", () => {
        callback(records);
      });
  }

  const structureProducts = (parsedProducts) => {
    let structuredProducts = parsedProducts.map((product) => {
      let structuredProduct = { ...product };

      // Structuring the description of the product
      let splitted_description_headings =
        structuredProduct.descriptionHeading.split(",");
      let splitted_descriptions = structuredProduct.description.split(",");

      let formattedDescription = [];

      for (let i = 0; i < splitted_description_headings.length; i++) {
        let desc_obj = {
          heading: splitted_description_headings[i],
          description: splitted_descriptions[i],
        };

        formattedDescription.push(desc_obj);
      }

      // Structuring the image paths
      let updated_image_paths = structuredProduct.imagePaths.split(",");

      // Structuring the pricing
      let structured_pricing = {
        mrp: structuredProduct.mrp,
        costPrice: structuredProduct.costPrice,
        salesPrice: structuredProduct.salesPrice,
      };

      // deleting all the extra key value pairs
      delete structuredProduct.descriptionHeading;
      delete structuredProduct.description;
      delete structuredProduct.costPrice;
      delete structuredProduct.salesPrice;
      delete structuredProduct.mrp;

      // setting the structured attributes
      structuredProduct.description = formattedDescription;
      structuredProduct.imagePaths = updated_image_paths;
      structuredProduct.pricing = structured_pricing;

      return structuredProduct;
    });
    return structuredProducts;
  };

  const handleApprove = async () => {
    setApproveLoading(true);
    let counter = 0;
    for (let product of products) {
      try {
        const { data } = await axios.post("/api/product/add", {
          productData: {
            productName: product.productName,
            storeId: request.storeId,
            category: product.category,
            subcategory: product.subcategory,
            imagePaths: product.imagePaths,
            pricing: product.pricing,
            description: product.description,
            tags: product.tags || [],
          },
        });

        console.log(data);

        if (data.success) {
          counter += 1;
        } else {
          console.log("product failed to add");
        }
      } catch (e) {
        toast.error("A product failed to add");
      }
    }
    toast.success(`${counter} products added successfully`);
    setApproveLoading(false);
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.post("/api/bulk-upload/fetch-request", {
        request_id,
      });
      if (data.success) {
        setRequest(data.bulk_upload_request);

        // Fetch CSV file from AWS
        const csvFile = await axios.get(data.bulk_upload_request.filePath);

        // Parse CSV data and store products as an array of objects
        parseCSV(csvFile.data, (records) => {
          // console.log(records);
          const structuredProducts = structureProducts(records);
          setProducts(structuredProducts);
        });
      } else {
        console.log("An error occurred");
      }
    })();
  }, []);

  return (
    <div className="bg-white p-3 rounded-md flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-lg">{request.storeName}</span>
          <span className="text-sm text-gray-500">
            {new Date(request.createdAt).toLocaleString()}
          </span>
        </div>
        {approveLoading ? (
          <Button className="bg-green-400" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Approving
          </Button>
        ) : (
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={handleApprove}
          >
            Approve
          </Button>
        )}
      </div>

      <div>
        {products.length ? <BulkProductList products={products} /> : null}
      </div>
    </div>
  );
};

export default ViewRequest;
