import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "../ui/badge";

const ViewBulkProduct = ({ productData }) => {
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...productData });

  const toggleEditing = () => {
    setEditing(!editing);

    if (!editing) setEditedData({ ...productData });
  };

  const handleChange = (e, field) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  const handleSave = () => {
    // Call save function here, pass editedData
    // After saving, exit edit mode
    setEditing(false);
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-sm rounded-xl">
      <div className="space-y-4">
        <div className="flex gap-5 items-center">
          {editing ? (
            <input
              type="text"
              value={editedData.imagePath}
              onChange={(e) => handleChange(e, "imagePath")}
              placeholder="Enter image URL"
            />
          ) : (
            <>
              {editedData.imagePaths.map((img_path, index) => (
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
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-semibold">Product Name: </Label>
            {editing ? (
              <input
                type="text"
                value={editedData.productName}
                onChange={(e) => handleChange(e, "productName")}
              />
            ) : (
              <span>{editedData.productName}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-2">
            <div>
              <Label className="font-semibold">MRP: </Label>
              {editing ? (
                <input
                  type="text"
                  value={editedData.pricing.mrp}
                  onChange={(e) => handleChange(e, "pricing.mrp")}
                />
              ) : (
                <span>{editedData.pricing.mrp}</span>
              )}
            </div>
            <div>
              <Label className="font-semibold">Cost Price: </Label>
              {editing ? (
                <input
                  type="text"
                  value={editedData.pricing.costPrice}
                  onChange={(e) => handleChange(e, "pricing.costPrice")}
                />
              ) : (
                <span>{editedData.pricing.costPrice}</span>
              )}
            </div>
            <div>
              <Label className="font-semibold">Sales Price: </Label>
              {editing ? (
                <input
                  type="text"
                  value={editedData.pricing.salesPrice}
                  onChange={(e) => handleChange(e, "pricing.salesPrice")}
                />
              ) : (
                <span>{editedData.pricing.salesPrice}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <Label className="font-semibold">Category: </Label>
              {editing ? (
                <input
                  type="text"
                  value={editedData.category}
                  onChange={(e) => handleChange(e, "category")}
                />
              ) : (
                <span>{editedData.category}</span>
              )}
            </div>
            <div>
              <Label className="font-semibold">Subcategory: </Label>
              {editing ? (
                <input
                  type="text"
                  value={editedData.subcategory}
                  onChange={(e) => handleChange(e, "subcategory")}
                />
              ) : (
                <span>{editedData.subcategory}</span>
              )}
            </div>
          </div>
        </div>

        {/* Show subcategories based on the selected category */}
        {productData.category && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Description:</Label>
              {editedData.description.map((desc, index) => (
                <div
                  key={index}
                  className="border flex flex-col p-2 rounded-md mb-2 gap-2"
                >
                  <span className="">{desc.heading}</span>
                  {editing ? (
                    <input
                      type="text"
                      value={desc.description}
                      onChange={(e) =>
                        handleChange(e, `description[${index}].description`)
                      }
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">{desc.description}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-4">
              <Label htmlFor="tags" className="font-semibold">
                Tags:
              </Label>
              {editedData.tags && editedData.tags.length ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {editedData.tags.map((tag, index) => (
                    <Badge variant="secondary" key={index}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {editing && (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Save
          </button>
        )}

        {!editing && (
          <button
            onClick={toggleEditing}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewBulkProduct;
