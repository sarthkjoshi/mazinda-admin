const mongoose = require("mongoose");

const ProductCDBSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, unique: true },
    pricing: { type: Object },
    category: { type: String },
    subcategory: { type: String },
    imagePaths: { type: Array },
    tags: { type: Array },
    description: { type: Array },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("ProductCDB", ProductCDBSchema);
