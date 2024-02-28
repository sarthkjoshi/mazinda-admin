const mongoose = require("mongoose");

const modeSchema = new mongoose.Schema({
  mode: {
    type: String,
    required: true,
    enum: ["automatic", "manual"],
    default: "automatic",
  },
});
mongoose.models = {};
export default mongoose.model("Mode", modeSchema);
