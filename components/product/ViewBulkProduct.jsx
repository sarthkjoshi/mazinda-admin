"use client";

import { Label } from "@/components/ui/label";

const ViewBulkProduct = ({ productData }) => {
  return (
    <div className="container mx-auto p-4 bg-white shadow-sm rounded-xl">
      <>
        <div className="space-y-4">
          <div className="flex gap-5 items-center">
            {productData.imagePaths.map((img_path, index) => (
              <div key={index} className="relative">
                <img
                  className="border aspect-square object-contain p-2 rounded-sm"
                  height={100}
                  width={100}
                  src={img_path}
                  alt="product"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Product Name: </Label>
              <span>{productData.productName}</span>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-2">
              <div>
                <Label className="font-semibold">MRP: </Label>
                <span>{productData.pricing.mrp}</span>
              </div>
              <div>
                <Label className="font-semibold">Cost Price: </Label>
                <span>{productData.pricing.costPrice}</span>
              </div>
              <div>
                <Label className="font-semibold">Sales Price: </Label>
                <span>{productData.pricing.salesPrice}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <Label className="font-semibold">Category: </Label>
                <span>{productData.category}</span>
              </div>

              <div>
                <Label className="font-semibold">Subcategory: </Label>
                <span>{productData.subcategory}</span>
              </div>
            </div>
          </div>

          {/* Show subcategories based on the selected category */}
          {productData.category && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Description:</Label>
                {productData.description.map((desc, index) => (
                  <div
                    key={index}
                    className="border flex flex-col p-2 rounded-md mb-2 gap-2"
                  >
                    <span className="">{desc.heading}</span>
                    <p className="text-gray-500 text-sm">{desc.description}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <Label htmlFor="tags" className="font-semibold">
                  Tags:
                </Label>
                {productData.tags && productData.tags.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {productData.tags.map((tag, index) => (
                      <Badge variant="secondary" key={index}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default ViewBulkProduct;
