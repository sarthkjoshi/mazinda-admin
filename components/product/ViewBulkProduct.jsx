import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "../ui/badge";
import Image from "next/image";
import axios from "axios";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const ViewBulkProduct = ({ productData, index }) => {
  const [editableData, setEditableData] = useState({ ...productData });
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const request_id = searchParams.get("request_id");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({ ...editableData, [name]: value });
  };

  const handleCancel = () => {
    setEditableData({ ...productData });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.post(`/api/bulk-upload/update-request/`, {
        editableData,
        request_id,
      });

      if (data.success) {
        setIsEditing(false);
        toast.success("Product data updated successfully");
      } else {
        setIsEditing(false);
        toast.error("Failed to update product data");
      }
    } catch (error) {
      setIsEditing(false);
      toast.error("Failed to update product data", error);
    }
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setSelectedCategory(value);
    setSelectedSubcategory(""); // Reset subcategory when changing category
    setEditableData({ ...editableData, category: value, subcategory: "" });
  };

  const handleSubcategoryChange = (e) => {
    const { value } = e.target;
    setSelectedSubcategory(value);
    setEditableData({ ...editableData, subcategory: value });
  };
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        "/api/bulk-upload/delete-individual-request",
        {
          data: { request_id, index },
        }
      );

      if (data.success) {
        toast.success("Product deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Failed to delete product", error);
    }
  };
  useEffect(() => {
    async function getCategories() {
      try {
        const response = await axios.get("/api/category/fetch-categories");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    getCategories();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-white shadow-sm rounded-xl">
      <>
        <div className="space-y-4">
          <div className="flex gap-5 items-center justify-between">
            <div className="relative">
              {isEditing ? (
                <input
                  type="text"
                  name="productName"
                  value={editableData.imagePaths}
                  onChange={handleInputChange}
                />
              ) : (
                <Image
                  className="border aspect-square object-contain p-2 rounded-sm"
                  height={100}
                  width={100}
                  src={editableData.imagePaths}
                  alt="imgpath"
                />
              )}
            </div>

            <Button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Product Name: </Label>
              {isEditing ? (
                <input
                  type="text"
                  name="productName"
                  value={editableData.productName}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{editableData.productName}</span>
              )}
            </div>

            <div>
              <Label className="font-semibold">Category: </Label>
              {isEditing ? (
                <select
                  name="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select a Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{editableData.category}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-2">
              <div>
                <Label className="font-semibold">MRP: </Label>
                {isEditing ? (
                  <input
                    type="text"
                    name="mrp"
                    value={editableData.mrp}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{editableData.mrp}</span>
                )}
              </div>
              <div>
                <Label className="font-semibold">Cost Price: </Label>
                {isEditing ? (
                  <input
                    type="text"
                    name="costPrice"
                    value={editableData.costPrice}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{editableData.costPrice}</span>
                )}
              </div>
              <div>
                <Label className="font-semibold">Sales Price: </Label>
                {isEditing ? (
                  <input
                    type="text"
                    name="salesPrice"
                    value={editableData.salesPrice}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{editableData.salesPrice}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <Label className="font-semibold">Subcategory: </Label>
                {isEditing ? (
                  <select
                    name="subcategory"
                    value={selectedSubcategory}
                    onChange={handleSubcategoryChange}
                    disabled={!selectedCategory} // Disable if no category selected
                  >
                    <option value="">Select a Subcategory</option>
                    {/* Populate options based on selected category */}
                    {categories
                      .find((cat) => cat.categoryName === selectedCategory)
                      ?.subcategories.map((subcategory, index) => (
                        <option key={index} value={subcategory}>
                          {subcategory}
                        </option>
                      ))}
                  </select>
                ) : (
                  <span>{editableData.subcategory}</span>
                )}
              </div>
            </div>
          </div>

          {editableData.category && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Description:</Label>

                <div className="border flex flex-col p-2 rounded-md mb-2 gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="descriptionHeading"
                      value={editableData.descriptionHeading}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{editableData.descriptionHeading}</span>
                  )}
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={editableData.description}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {editableData.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="tags" className="font-semibold">
                  Tags:
                </Label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {isEditing ? (
                    <input
                      type="text"
                      name="tags"
                      value={editableData.tags}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Badge variant="secondary">{editableData.tags}</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </>

      <div className="flex justify-end">
        {isEditing ? (
          <>
            <Button className="btn btn-secondary mr-2" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="btn btn-primary" onClick={handleSave}>
              Save
            </Button>
          </>
        ) : (
          <Button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default ViewBulkProduct;
