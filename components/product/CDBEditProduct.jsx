import { useState, useEffect } from "react";
import axios from "axios";
import OvalLoader from "@/components/utility/OvalLoader";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CDBEditProduct = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({});
  const [editedDescription, setEditedDescription] = useState([]);

  const [categories, setCategories] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.post("/api/category/fetch-categories");
      const fetchedCategories = data.categories;
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getSubcategories = (selectedCategory) => {
    // Find the selected category in the categories data
    const selectedCategoryData = categories.find(
      (category) => category.categoryName === selectedCategory
    );
    return selectedCategoryData ? selectedCategoryData.subcategories : [];
  };

  const fetchProductData = async () => {
    try {
      const { data } = await axios.post("/api/cdb/fetch-product-by-id", {
        id,
      });
      if (data.success) {
        setProductData({
          ...data.product,
          tags: data.product.tags || [],
        });
        setEditedDescription(data.product.description);
        setLoading(false);
      } else {
        console.error("Error while fetching the product");
      }
    } catch (error) {
      console.error("Error fetching product data: ", error);
    }
  };

  const handleProductDelete = async (_id) => {
    const { data } = await axios.put("/api/cdb/delete", { _id });
    if (data.success) {
      toast.success("Product deleted successfully");
    } else {
      toast.error("Error deleting the product");
    }
  };

  const handleSaveClick = async () => {
    setSaveLoading(true);
    try {
      const { data } = await axios.put("/api/cdb/update", {
        productData: { ...productData, description: editedDescription },
      });

      if (data.success) {
        setIsSaved(true);
        setSaveLoading(false);
        setTimeout(() => {
          setIsSaved(false);
        }, 1500);
      } else {
        toast.error(data.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error saving product data: ", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDescriptionChange = (index, field, event) => {
    const newDescription = [...editedDescription];
    newDescription[index][field] = event.target.value;
    setEditedDescription(newDescription);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Handle nested objects like pricing
    if (name.includes(".")) {
      const [fieldName, nestedField] = name.split(".");
      setProductData({
        ...productData,
        [fieldName]: {
          ...productData[fieldName],
          [nestedField]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      // Update the productData object with the edited value
      setProductData({
        ...productData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleTagsChange = (e) => {
    const newTags = e.target.value.split(",").map((tag) => tag.trimStart());

    setProductData((prevData) => ({
      ...prevData,
      tags: newTags || [], // Provide a default empty array if tags is undefined
    }));
  };

  const handleRemoveTag = (tag) => {
    const updatedTags = (productData.tags || []).filter((t) => t !== tag);

    setProductData((prevData) => ({
      ...prevData,
      tags: updatedTags,
    }));
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);
  console.log("sa", productData);
  return (
    <div className="container mx-auto p-4 bg-white shadow-sm rounded-xl">
      {loading ? (
        <OvalLoader />
      ) : (
        <>
          <form className="space-y-4">
            <div className="flex gap-5 items-center">
              {productData.imagePaths.map((img_path) => (
                <div className="relative">
                  <span
                    onClick={() => {
                      const updatedImgPaths = productData.imagePaths.filter(
                        (path) => path !== img_path
                      );
                      setProductData((prev) => ({
                        ...prev,
                        imagePaths: updatedImgPaths,
                      }));
                    }}
                    className="text-sm border rounded-full px-[7px] py-0 absolute -top-2 -right-2 bg-red-500 text-white hover:bg-gray-200 cursor-pointer flex items-center justify-center"
                  >
                    ⨯
                  </span>
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
                <Label className="font-semibold">Product Name:</Label>
                <Input
                  type="text"
                  name="productName"
                  value={productData.productName}
                  onChange={handleChange}
                />
              </div>
              {/* <div>
                <Label className="font-semibold">Approved Status:</Label>
                <select
                  name="approvalStatus"
                  value={productData.approvalStatus}
                  onChange={handleChange}
                  className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 ${
                    productData.approvalStatus
                      ? "bg-green-300"
                      : "bg-yellow-300"
                  }`}
                >
                  <option value={true}>Approved</option>
                  <option value={false}>Pending</option>
                </select>
              </div> */}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="font-semibold">MRP:</Label>
                <Input
                  type="text"
                  name="pricing.mrp"
                  value={productData?.pricing?.mrp}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className="font-semibold">Cost Price:</Label>
                <Input
                  type="text"
                  name="pricing.costPrice"
                  value={productData?.pricing?.costPrice}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className="font-semibold">Sales Price:</Label>
                <Input
                  type="text"
                  name="pricing.salesPrice"
                  value={productData?.pricing?.salesPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Show subcategories based on the selected category */}
            {productData.category && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Category:</Label>
                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category.categoryName}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="font-semibold">Subcategory:</Label>
                  <select
                    name="subcategory"
                    value={productData.subcategory}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  >
                    {getSubcategories(productData.category).map(
                      (subcategory) => (
                        <option key={subcategory} value={subcategory}>
                          {subcategory}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <Label className="font-semibold">Description:</Label>
                  {editedDescription.map((desc, index) => (
                    <div
                      key={index}
                      className="border flex flex-col p-2 rounded-md mb-2 gap-2"
                    >
                      <Input
                        value={desc.heading}
                        onChange={(e) =>
                          handleDescriptionChange(index, "heading", e)
                        }
                      />
                      <Textarea
                        value={desc.description}
                        onChange={(e) =>
                          handleDescriptionChange(index, "description", e)
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <Label htmlFor="tags" className="font-semibold">
                    Tags:
                  </Label>
                  <div className="flex items-center">
                    <Input
                      type="text"
                      id="tags"
                      name="tags"
                      value={
                        productData.tags ? productData.tags.join(", ") : ""
                      }
                      onChange={handleTagsChange}
                      placeholder="Enter tags (comma separated)"
                    />
                  </div>
                  {productData.tags.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {productData.tags.map((tag, index) => (
                        <Badge variant="secondary" key={index}>
                          {tag}
                          <button
                            type="button"
                            variant="destructive"
                            className="ml-2 text-red-500"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            x
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </form>

          <div className="flex gap-2 mt-4">
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the product.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="px-0">
                    <Button
                      onClick={() => handleProductDelete(productData._id)}
                      variant="destructive"
                    >
                      Continue
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {saveLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : isSaved ? (
              <Button className="bg-green-500 text-white">Saved ✓</Button>
            ) : (
              <Button className="px-6" onClick={handleSaveClick}>
                Save
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CDBEditProduct;
