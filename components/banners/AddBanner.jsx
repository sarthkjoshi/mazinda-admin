"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { toast } from "sonner";

const AddBanner = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [bannerData, setBannerData] = useState({
    image: "",
    banner_type: "",
    link_type: "no-link",
    category_id: "",
    product_id: "",
    external_link: "",
    city_ids: [],
  });

  useEffect(() => {
    console.log(bannerData);
  }, [bannerData]);

  const [locations, setLocations] = useState([]);
  const [file, setFile] = useState();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.post("/api/category/fetch-categories");
      const fetchedCategories = data.categories;
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getLocations = async () => {
    try {
      const response = await axios.post("/api/location/fetch-locations");
      setLocations(response.data.locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleChange = (e) => {
    const { name, options } = e.target;
    if (name == "city_ids") {
      let selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setBannerData((prevState) => ({
        ...prevState,
        [name]: selectedValues,
      }));
    }
  };

  const handleSaveClick = async (e) => {
    console.log("banner data", bannerData);
    e.preventDefault();
    setSubmitLoading(true);
    setErrors({});
    if (!file) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Image is required",
      }));
      setSubmitLoading(false);
      return;
    }

    if (bannerData.city_ids.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        city_ids: "Please select at least one city",
      }));
      setSubmitLoading(false);
      return;
    }

    if (!bannerData.link_type) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        link_type: "Please select image link type",
      }));
      setSubmitLoading(false);
      return;
    }

    if (bannerData.link_type === "category" && !bannerData.category_id) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        category_id: "Please select a category",
      }));
      setSubmitLoading(false);
      return;
    }

    try {
      // first upload file
      const data = new FormData();
      data.set("file", file);
      data.set("banner_type", bannerData.banner_type);

      const res = await fetch("/api/upload/banner", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        const response = await axios.post("/api/banner/add", {
          ...bannerData,
          image: json.location,
        });

        console.log(response.data);

        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }

        setBannerData({
          image: "",
          banner_type: "",
          link_type: "no-link",
          category_id: "",
          product_id: "",
          external_link: "",
          city_ids: [],
        });
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.log(error);
    }

    //
    console.log("bannerData : " + JSON.stringify(bannerData));

    setSubmitLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    getLocations();
  }, []);

  return (
    <div className="overflow-x-auto p-2 border border-gray-200 rounded-md flex flex-col gap-2 h-fit">
      <div className="col-span-full">
        <Label
          htmlFor="image"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Image
        </Label>
        <div className="mt-2 flex items-center gap-x-3">
          <Input
            onChange={(e) => setFile(e.target.files?.[0])}
            type="file"
            name="file"
            id="image"
          />
        </div>
        {errors.image && <span className="text-red-500">{errors.image}</span>}
      </div>

      <div className="col-span-full">
        <label
          htmlFor="city_ids"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          City
        </label>
        <div className="mt-2 flex items-center gap-x-3">
          <select
            multiple
            onChange={handleChange}
            name="city_ids"
            id="city_ids"
            className="rounded-md px-3 py-1 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset"
          >
            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {location.city}
              </option>
            ))}
          </select>
        </div>
        {errors.city_ids && (
          <span className="text-red-500">{errors.city_ids}</span>
        )}
      </div>

      <div className="col-span-full">
        <label
          htmlFor="banner_type"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Banner Type
        </label>
        <div className="mt-2 flex items-center gap-x-3">
          <Select
            required
            onValueChange={(value) =>
              setBannerData({
                ...bannerData,
                banner_type: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Please select banner type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="promotional">Promotional</SelectItem>
              <SelectItem value="looking-for">
                What are you looking for
              </SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="col-span-full">
        <Label
          htmlFor="link_type"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Banner Link
        </Label>
        <div className="mt-2 flex items-center gap-x-3">
          <Select
            onValueChange={(value) =>
              setBannerData({
                ...bannerData,
                link_type: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Please select link type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="category">Link to Category</SelectItem>
              <SelectItem value="product">Link to Product</SelectItem>
              <SelectItem value="external_link">External Link</SelectItem>
              <SelectItem value="no_link">No Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.link_type && (
          <span className="text-red-500">{errors.link_type}</span>
        )}
      </div>

      {bannerData.link_type == "category" && (
        <div className="col-span-full">
          <label
            htmlFor="category_id"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Category
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <Select
              onValueChange={(value) =>
                setBannerData({
                  ...bannerData,
                  category_id: value,
                })
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Please select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.category_id && (
            <span className="text-red-500">{errors.category_id}</span>
          )}
        </div>
      )}
      {bannerData.link_type == "product" && (
        <div className="col-span-full">
          <label
            htmlFor="product_id"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Product Id
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <Input
              type="text"
              value={bannerData.product_id}
              onChange={(e) =>
                setBannerData({
                  ...bannerData,
                  product_id: e.target.value,
                })
              }
            />
          </div>
          {errors.category_id && (
            <span className="text-red-500">{errors.category_id}</span>
          )}
        </div>
      )}
      {bannerData.link_type == "external_link" && (
        <div className="col-span-full">
          <Label
            htmlFor="external_link"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            External Link
          </Label>
          <div className="mt-2 flex items-center gap-x-3">
            <Input
              type="text"
              value={bannerData.external_link}
              onChange={(e) =>
                setBannerData({
                  ...bannerData,
                  external_link: e.target.value,
                })
              }
            />
          </div>
        </div>
      )}

      <div className="col-span-full mt-4 text-center">
        {submitLoading ? (
          <Button type="button">Please wait...</Button>
        ) : (
          <Button type="submit" onClick={handleSaveClick}>
            Add Banner
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddBanner;
