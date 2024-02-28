"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const Mode = () => {
  const [mode, setMode] = useState("");
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMode() {
      try {
        const response = await axios.get("/api/mode");
        const fetchedMode = response.data.mode;
        setMode(fetchedMode);
        setIsAutomatic(fetchedMode === "automatic");
      } catch (error) {
        console.error("Error getting mode:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMode();
  }, []);

  const handleModeChange = async () => {
    const newMode = isAutomatic ? "manual" : "automatic";
    try {
      const response = await axios.post("/api/mode", {
        newMode,
      });

      if (response.status === 200) {
        setMode(newMode);
        setIsAutomatic(!isAutomatic);
        console.log("Mode set to:", newMode);
      } else {
        console.error("Failed to set mode:", response.statusText);
      }
    } catch (error) {
      console.error("Error setting mode:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>
        Current Mode:{" "}
        <span className="text-red-600 bg-gray-300 p-1 rounded-md">{mode}</span>
      </p>

      <div className="flex gap-5 m-2">
        <p>{isAutomatic ? "Automatic Mode" : "Manual Mode"}</p>

        <label className="switch">
          <input
            type="checkbox"
            checked={isAutomatic}
            onChange={handleModeChange}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default Mode;
