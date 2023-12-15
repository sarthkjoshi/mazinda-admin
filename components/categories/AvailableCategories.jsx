"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";

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

import { Input } from "@/components/ui/input";

const AvailableCategories = () => {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [editingMode, setEditingMode] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState("");

  // const handleSubcategoryChange = (index, newValue) => {
  //   // Handle changes to subcategories in the state
  //   const updatedSubcategories = [...selectedCategory.subcategories];
  //   updatedSubcategories[index] = newValue;

  //   setSelectedCategory({
  //     ...selectedCategory,
  //     subcategories: updatedSubcategories,
  //   });
  // };

  const handleAddSubcategory = () => {
    if (newSubcategory === "") {
      toast.error("Subcategory is empty");
      return;
    }
    // Handle adding a new subcategory
    const newSubcategories = [
      ...selectedCategory.subcategories,
      newSubcategory,
    ];
    setSelectedCategory({
      ...selectedCategory,
      subcategories: newSubcategories,
    });
    setNewSubcategory("")
  };

  // const handleDeleteSubcategory = (index) => {
  //   // Handle deleting a subcategory
  //   const updatedSubcategories = [...selectedCategory.subcategories];
  //   updatedSubcategories.splice(index, 1);

  //   setSelectedCategory({
  //     ...selectedCategory,
  //     subcategories: updatedSubcategories,
  //   });
  // };

  const handleSaveClick = async () => {
    const { data } = await axios.post('/api/category/edit-category', { updated_category: selectedCategory });

    console.log(data);
    if (data.success) {
      toast.success(data.message)
    } else {
      toast.error(data.error)
    }

    router.refresh();

    setEditingMode(false);
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.post("/api/category/fetch-categories");
      setCategories(data.categories);
    })();
  }, []);

  return (
    <div className="bg-white p-5 rounded-xl">
      <AlertDialog>
        <h1 className="text-2xl font-semibold mb-2">Available Categories</h1>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedCategory.categoryName}</AlertDialogTitle>
            <AlertDialogDescription>
              <div>
                <ul>
                  {Object.keys(selectedCategory).length &&
                    selectedCategory.subcategories.map((subcategory) => (
                      <li
                        key={subcategory}
                        className="text-gray-600 text-sm list-none inline-block bg-gray-200 m-1 rounded-full py-1 px-2"
                      >
                        {subcategory}
                      </li>
                    ))}
                </ul>
                {editingMode && (
                  <div>
                    <Input
                      type="text"
                      value={newSubcategory}
                      onChange={(e) => { setNewSubcategory(e.target.value) } }
                      className="my-2"
                    />
                    <span className="text-red-500 text-sm"></span>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setEditingMode(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            {editingMode ? (
              <>
                <button
                  onClick={handleAddSubcategory}
                  className="ml-2 bg-[#0f172a] text-white px-4 py-1 rounded-sm text-sm"
                >
                  Add Subcategory
                </button>
                <AlertDialogAction onClick={handleSaveClick}>
                  Save
                </AlertDialogAction>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingMode(true);
                  }}
                  className="bg-[#0f172a] text-white px-4 py-1 rounded-sm text-sm"
                >
                  Edit
                </button>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>

        <div className="flex flex-wrap">
          {categories.map((category) => (
            <AlertDialogTrigger
              onClick={() => {
                setSelectedCategory(category);
              }}
              key={category._id}
              className="bg-gray-50 rounded-lg shadow-sm border p-4 hover:shadow-lg w-56 h-56 m-2 overflow-scroll"
            >
              <h2 className="text-2xl font-semibold mb-2 text-center">
                {category.categoryName}
              </h2>
              <ul className="list-disc ml-4">
                {category.subcategories.map((subcategory) => (
                  <li
                    key={subcategory}
                    className="text-gray-600 text-sm list-none inline-block bg-gray-200 m-1 rounded-full py-1 px-2"
                  >
                    {subcategory}
                  </li>
                ))}
              </ul>
            </AlertDialogTrigger>
          ))}
        </div>
      </AlertDialog>
    </div>
  );
};

export default AvailableCategories;
