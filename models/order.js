const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const OrderSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    default: null,
  },
  product_name: {
    type: String,
    default: "",
  },
  quantity: {
    type: Number,
    default: 0,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    default: "",
  },
  date: {
    type: Number,
    default: Date.now(),
  },
});
const Order = mongoose.model("order", OrderSchema);
module.exports = Order;
