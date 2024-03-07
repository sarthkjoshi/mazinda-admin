"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const items = [
  {
    path: "/",
    label: "Dashboard",
  },
  {
    path: "/manage-shops",
    label: "Manage Shops",
  },
  {
    path: "/product-approval",
    label: "Product Management",
  },
  {
    path: "/bulk-upload-requests",
    label: "Bulk Upload Requests",
  },
  {
    path: "/food-management",
    label: "Food Management",
  },
  {
    path: "/coupons",
    label: "Coupons",
  },
  {
    path: "/categories",
    label: "Category",
  },
  {
    path: "/locations",
    label: "Location",
  },
  {
    path: "/manage-layout",
    label: "Layout Management",
  },
  {
    path: "/admin-management",
    label: "Admin Management",
  },
];

const AssignAdmin = () => {
  const [allowedPaths, setAllowedPaths] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/user/assign-admin", {
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        allowedPaths,
      });

      console.log(data);
      if (data.success) {
        toast.success(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Network error");
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="bg-white p-5 rounded-lg w-1/3" onSubmit={handleSubmit}>
      <h1 className="font-semibold text-xl mb-5">Assign a new admin</h1>

      <div className="my-4 flex flex-col gap-2">
        <Label className="text-base">Phone Number</Label>
        <Input
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              phoneNumber: e.target.value,
            })
          }
          required
          placeholder="Enter the phone number"
          type="tel"
        />
      </div>
      <div className="my-4 flex flex-col gap-2">
        <Label className="text-base">Assign Password</Label>
        <Input
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
          required
          placeholder="Assign a password"
          type="text"
        />
      </div>

      <div>
        <div className="mb-4">
          <Label className="text-base">Allowed Features</Label>
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex my-2 gap-2">
            <Checkbox
              checked={allowedPaths?.includes(item.path)}
              onCheckedChange={(checked) => {
                return checked
                  ? setAllowedPaths([...allowedPaths, item.path])
                  : setAllowedPaths(
                      allowedPaths?.filter((path) => path !== item.path)
                    );
              }}
            />
            <Label className="font-normal">{item.label}</Label>
          </div>
        ))}
      </div>

      {error ? <Label className="text-red-500 text-md">{error}</Label> : null}

      {submitting ? (
        <Button className="w-full my-4" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button className="my-4 w-full" type="submit">
          Submit
        </Button>
      )}
    </form>
  );
};

export default AssignAdmin;
