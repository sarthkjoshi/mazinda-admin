import React from "react";
import CutleryDetails from "./CutleryDetails";
import Alert from "./Alert";

export default function FoodDetails() {
  return (
    <div className="flex flex-col gap-3">
      <CutleryDetails />
      <Alert />
    </div>
  );
}
