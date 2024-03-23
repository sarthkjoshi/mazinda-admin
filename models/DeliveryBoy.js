const mongoose = require("mongoose");
const DeliveryBoySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    groupid: {
      type: String,
      default: "abcdef",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("DeliveryBoy", DeliveryBoySchema);
