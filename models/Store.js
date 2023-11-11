const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    ownerName: { type: String, required: true },
    storeName: { type: String, required: true },
    mobileNumber: { type: Number, required: true, unique: true },
    alternateMobileNumber: { type: Number, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    storeAddress: { type: Object, required: true },
    products: { type: Number, default: 0 },
    category: { type: String },
    imageURI: { type: String, default: "https://images.examples.com/wp-content/uploads/2017/05/Store-Inventory-Examples-amp-Samples2.jpg" },
    openStatus: { type: Boolean, default: true },
    ordersHistory: { type: Array, default: [] },
    currentOrders: { type: Array, default: [] },
    approvedStatus: { type: String, default: "pending" }
}, { timestamps: true });

mongoose.models = {}
export default mongoose.model("Store", StoreSchema);