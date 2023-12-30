"use client";

import { useState } from "react";

const EditImageForm = ({ existingImagePath }) => {
  const [file, setFile] = useState(null);
  const [imagePath, setImagePath] = useState(existingImagePath);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEditImage = async () => {
    if (!file || !imagePath) {
      setError("Please provide both file and imagePath");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("imagePath", imagePath);

    try {
      const response = await fetch("/api/upload/edit-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setSuccess(`Image replaced successfully`);
        setError(null);
      } else {
        setError(`Error replacing image: ${data.error}`);
        setSuccess(null);
      }
    } catch (error) {
      console.error("Error editing image:", error);
      setError("An unexpected error occurred while editing the image");
      setSuccess(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-gray-500">
        Click browse to choose the image and save
      </label>
      <label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>
      <br />
      <button
        className="bg-yellow-500 px-3 py-1 text-white rounded-md"
        onClick={handleEditImage}
      >
        Save
      </button>
      <br />
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default EditImageForm;
