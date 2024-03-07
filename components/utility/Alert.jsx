"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";

const Alert = () => {
  const [alertData, setAlertData] = useState({ message: "", isActive: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchAlertData();
  }, []);

  const fetchAlertData = async () => {
    try {
      const response = await axios.get("/api/alert");
      setAlertData(response.data.alert);
      setLoading(false);
    } catch (error) {
      setError("Error fetching alert data.");
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === "checkbox" ? checked : value;
    setAlertData({ ...alertData, [name]: inputValue });
  };

  const handleUpdateAlert = async () => {
    try {
      await axios.put("/api/alert", alertData);
      alert("Alert updated successfully.");
      setEditMode(false);
    } catch (error) {
      setError("Error updating alert.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex justify-center flex-col bg-white p-4 rounded-lg w-[500px] border border-gray-200">
      <h1 className="text-2xl font-semibold mb-5 text-center">Alert</h1>
      {editMode ? (
        <>
          <label>
            Message:
            <input
              type="text"
              name="message"
              value={alertData.message}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Active:
            <input
              type="checkbox"
              name="isActive"
              checked={alertData.isActive}
              onChange={handleInputChange}
            />
          </label>
          <div className="flex gap-2">
            <Button onClick={handleUpdateAlert}>Update Alert</Button>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
          </div>
        </>
      ) : (
        <>
          <p>Message: {alertData.message}</p>
          <p>Active: {alertData.isActive ? "Yes" : "No"}</p>
          <Button className="w-16" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        </>
      )}
    </div>
  );
};

export default Alert;
