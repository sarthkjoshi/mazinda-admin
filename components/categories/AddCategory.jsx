"use client";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const AddCategory = () => {
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImagePath, setNewCategoryImagePath] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState();

  const onFileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      console.log(json)

      // handling the error
      if (!json.success) throw new Error(await res.text());
      else {
        setNewCategoryImagePath(json.location);
        toast.success("Image uploaded successfully");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCategory = (e) => {
    setNewCategory(e.target.value);
  };

  const handleChangeSubcategory = (e) => {
    setNewSubcategory(e.target.value);
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.trim() !== "") {
      setSubcategories([...subcategories, newSubcategory]);
      setNewSubcategory("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post("/api/category/add-new-category", {
      categoryName: newCategory,
      categoryImage: newCategoryImagePath,
      subcategories,
    });

    if (response.data.success) {
      toast.success(response.data.message);
      setNewCategory("");
      setSubcategories([]);
    }
  };

  return (
    <div className="mx-2 bg-white rounded-xl p-4">
      <h2 className="text-2xl">Add Category</h2>
      <div className="mt-4">
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Category Name
          </label>
          <input
            type="text"
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter category name"
            value={newCategory}
            onChange={handleChangeCategory}
          />
        </div>
        <form className="border p-2" onSubmit={onFileSubmit}>
          <input
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <input
            className="w-fit my-2 bg-blue-500 px-4 py-2 text-white rounded-lg"
            type="submit"
            value={loading ? "Uploading..." : "Upload"}
          />
        </form>
      </div>
      <div className="mt-4">
        <h3>Add Subcategories:</h3>
        <div className="flex items-center">
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter subcategory name"
            value={newSubcategory}
            onChange={handleChangeSubcategory}
          />
          <button
            onClick={handleAddSubcategory}
            className="bg-black hover:opacity-70 text-white font-bold py-2 px-4 rounded ml-2"
          >
            +
          </button>
        </div>
      </div>
      {subcategories.length > 0 && (
        <div className="my-1">
          <ul>
            {subcategories.map((subcategory, index) => (
              <li key={index}>{subcategory}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="my-4">
        <button
          onClick={handleSubmit}
          className="bg-black hover:opacity-70 rounded-full text-white font-bold py-2 px-4"
        >
          Add Category
        </button>
      </div>
    </div>
  );
};

export default AddCategory;
