"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

const BulkUploadRequest = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.post("/api/bulk-upload/fetch-all-requests");
      console.log(data);
      if (data.success) {
        setRequests(data.bulk_upload_requests.reverse());
      } else {
        console.log("error occurred");
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Bulk Upload Requests</h1>

      <div className="mt-3 flex flex-col gap-3">
        {requests.map((request, index) => (
          <div
            key={request._id}
            className="bg-white p-3 rounded-md flex justify-between items-center"
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">
                {new Date(request.createdAt).toLocaleString()}.{" "}
              </span>
              <span>{request.storeName}</span>
            </div>

            <div className="flex gap-2">
              <Button>
                <a href={request.filePath} download>
                  Download File
                </a>
              </Button>
              <Button variant="secondary">
                <Link
                  href={`/bulk-upload-requests/view?request_id=${request._id}`}
                >
                  View
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulkUploadRequest;
