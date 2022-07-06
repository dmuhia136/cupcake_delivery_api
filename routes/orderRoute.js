const OrderSchema = require("../models/order");
const express = require("express");
const orderRoute = express.Router();

//get all orders
orderRoute.get("/", async (req, res) => {
  try {
    var response = await OrderSchema.find().populate("user");
    res.json({ status: true, body: response });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

//create order
orderRoute.post("/", async (req, res) => {
  try {
    var order = new OrderSchema(req.body);
    var response = await order.save();
    res.json({ status: true, body: response });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

//get one oder
orderRoute.get("/:id", async (req, res) => {
  try {
    var response = await OrderSchema.findById({ _id: req.params.id }).populate(
      "user"
    );
    res.json({ status: true, body: response });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

//update order
orderRoute.patch("/:id", async (req, res) => {
  try {
    var response = await OrderSchema.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      },
      { new: true },
      (err, data) => {
        if (data == null) {
          res.json({ status: false, message: "No order found" });
        } else {
          res.json({ status: true, body: data });
        }
      }
    );
    res.json({ status: true, body: response });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

//get order by userid
orderRoute.get("/userorders/:userid", async (req, res) => {
  try {
    var response =await OrderSchema.find({ user: req.params.userid }).populate("user");
    res.json({ status: true, body: response });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

//delete order
orderRoute.delete("/:id", async (req, res) => {
  try {
    OrderSchema.deleteOne({ _id: req.params.id });
    res.json({ status: true, message: "Order deleted" });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});
module.exports=orderRoute;