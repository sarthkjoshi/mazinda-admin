const mongoose = require("mongoose");
require("../libs/mongoose");
const FoodOrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    vendorId: { type: String, required: true },
    vendorName: { type: String },
    products: { type: Object, required: true },
    address: { type: Object, required: true },
    amount: { type: Number, required: true },
    instructions: { type: String },
    vendorOTP: { type: Number },
    userOTP: { type: Number },
    vendorVerified: { type: Boolean, default: false },
    userVerified: { type: Boolean, default: false },
    externalDeliveryRequired: { type: Boolean },
    cutleryQuantity: { type: Number },
    paymentInfo: { type: Object },
    paymentMethod: { type: String },
    status: { type: String, default: "Processing" },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("FoodOrder", FoodOrderSchema);
