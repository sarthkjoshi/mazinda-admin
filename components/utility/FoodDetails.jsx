import React from "react";
import CutleryDetails from "./CutleryDetails";
import AlertDetails from "./AlertDetails";

export default function FoodDetails() {
  return (
    <div className="flex flex-col gap-3">
      <CutleryDetails />
      <AlertDetails />
    </div>
  );
}
