"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ShowLayout = () => {
  const [banners, setBanners] = useState([]);

  const renderBannersTable = (banners, img_width) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Link To</TableHead>
          {/* <TableHead>City</TableHead> */}
          {/* <TableHead>Options</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {banners.map((banner) => (
          <TableRow key={banner._id}>
            <TableCell>{banner._id.slice(-5)}</TableCell>
            <TableCell>
              <img
                src={banner.image}
                width={img_width}
                className="object-contain"
                alt="Section Image"
              />
            </TableCell>
            <TableCell>
              {banner.link_type == "category"
                ? banner.category_id
                : banner.link_type === "product"
                ? banner.product_id
                : banner.link_type === "external_link"
                ? banner.external_link
                : "No Link"}
            </TableCell>
            {/* <TableCell>{banner..join(", ")}</TableCell> */}
            {/* <TableCell>
                    <Button onClick={()=>deleteSection(section._id,section.image)} className="mr-3 bg-red-500">Delete</Button>
                    <Button
                      onClick={() => handleDelete(section._id, section.image)}
                      className="mr-3 bg-red-500"
                      disabled={deletingState[section._id]}
                    >
                      {deletingState[section._id] ? 'Please wait...' : 'Delete'}
                    </Button>
                    <Button>Edit</Button>
                </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableCell className="right-0">
          <Button
            onClick={() => setNewSection((newSection) => !newSection)}
            className="bg-yellow-500 px-3 py-1 text-white rounded-md"
          >
            {!newSection ? "Add New" : "Cancel"}
          </Button>
        </TableCell>
      </TableFooter> */}
    </Table>
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post("/api/banner/fetch-all");
        console.log(data);
        if (data.success) {
          setBanners(data.banners);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-3">
      <div className="border border-gray-200 p-2 rounded-lg flex flex-col gap-5">
        <h1 className="text-center text-xl">Top Carousel</h1>
        {renderBannersTable(
          banners.filter((banner) => banner.banner_type === "carousel"),
          400
        )}
      </div>

      <div className="border border-gray-200 p-5 rounded-lg flex flex-col gap-5">
        <h1 className="text-center text-xl">What are you looking for ?</h1>
        {renderBannersTable(
          banners.filter((banner) => banner.banner_type === "looking-for"),
          100
        )}
      </div>

      <div className="border border-gray-200 p-5 rounded-lg flex flex-col gap-5">
        <h1 className="text-center text-xl">Promotional Banners</h1>
        {renderBannersTable(
          banners.filter((banner) => banner.banner_type === "promotional"),
          400
        )}
      </div>
    </div>
  );
};

export default ShowLayout;
