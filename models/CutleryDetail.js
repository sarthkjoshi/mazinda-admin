const mongoose = require("mongoose");

const CutleryDetailsSchema = new mongoose.Schema({
  isAvailable: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

mongoose.models = {};
export default mongoose.model("CutleryDetail", CutleryDetailsSchema);
