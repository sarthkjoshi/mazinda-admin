"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "react-multi-select-component";

import axios from "axios";

const CreateCoupon = () => {
  const initialCouponState = {
    code: "",
    isActive: true,
    discount: 0,
    discountType: "percentage",
    discountOn: "",
    maxLimit: 0,
    minOrder: 0,
    usageLimit: 1,
    categories: [],
    cities: [],
    description: "",
  };

  const [coupon, setCoupon] = useState(initialCouponState);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for the "type" field
    if (name === "type") {
      const selectedType = value;
      setCoupon({ ...coupon, [name]: selectedType });
    } else {
      // For other fields, use the value directly
      setCoupon({ ...coupon, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    console.log("coupon", coupon);
    setLoading(true);
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/coupon/add-coupon", { coupon });
      console.log(data);
      if (data.success) {
        toast("coupon added successfully");
        setCoupon(initialCouponState);
      } else {
        toast("An error occurred while adding the coupon");
      }
    } catch (err) {
      toast("An error occurred ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.post("/api/location/fetch-locations");
      setCities(data.locations.map((city) => city.city));
    })();

    (async () => {
      const { data } = await axios.post("/api/category/fetch-categories");
      setCategories(data.categories.map((category) => category.categoryName));
    })();
  }, []);

  useEffect(() => {
    setCoupon({
      ...coupon,
      categories: selectedCategories.map(
        (categoryDetail) => categoryDetail.value
      ),
    });
  }, [selectedCategories]);

  useEffect(() => {
    setCoupon({
      ...coupon,
      cities: selectedCities.map((cityDetail) => cityDetail.value),
    });
  }, [selectedCities]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-xl mb-4 font-semibold text-center">Create Coupon</h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
        <div>
          <Label>Coupon Code</Label>

          <Input
            type="text"
            id="code"
            name="code"
            placeholder="Coupon Code"
            className="text-gray-600 font-extrabold"
            value={coupon.code.toUpperCase()}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-1">
          <div>
            <Label>Discount On</Label>
            <Select
              id="discountOn"
              name="discountOn"
              value={coupon.discountOn}
              onValueChange={(selectedOption) =>
                setCoupon({ ...coupon, discountOn: selectedOption })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deliveryCharge">Delivery Charge</SelectItem>
                <SelectItem value="subtotal">Subtotal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Discount Value</Label>
            <Input
              type="number"
              id="discount"
              name="discount"
              placeholder="Discount"
              value={coupon.discount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Discount Type</Label>
            <Select
              id="type"
              name="type"
              value={coupon.discountType}
              onValueChange={(selectedOption) =>
                setCoupon({ ...coupon, discountType: selectedOption })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
          <div>
            <Label>Usage Limit</Label>
            <Input
              type="number"
              id="usageLimit"
              name="usageLimit"
              placeholder="Usage Limit"
              value={coupon.usageLimit}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Max Amount Limit</Label>
            <Input
              type="number"
              id="maxLimit"
              name="maxLimit"
              placeholder="Max Limit"
              value={coupon.maxLimit}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Min Order Value</Label>
            <Input
              type="number"
              id="minOrder"
              name="minOrder"
              placeholder="Min Order"
              value={coupon.minOrder}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div>
          <Label>Choose applicable categories</Label>
          <MultiSelect
            options={categories.map((category) => ({
              label: category,
              value: category,
            }))}
            value={selectedCategories}
            onChange={setSelectedCategories}
            labelledBy="Select Categories"
          />
        </div>

        <div>
          <Label>Choose applicable cities</Label>
          <MultiSelect
            options={cities.map((city) => ({ label: city, value: city }))}
            value={selectedCities}
            onChange={setSelectedCities}
            labelledBy="Select Cities"
          />
        </div>

        <div>
          <Label>Enter Coupon Description</Label>
          <Textarea
            type="text"
            id="description"
            name="description"
            placeholder="Description"
            value={coupon.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex justify-center items-center">
          {loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit">Add Coupon</Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateCoupon;
