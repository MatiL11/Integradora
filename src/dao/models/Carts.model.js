const mongoose = require("mongoose");
const Products = require("./Products.model");
const { string } = require("joi");
const collectionName = "carts";

const collectionSchema = new mongoose.Schema({
  productos: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Products,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  userId: {
    type: String,
  },
});

const Cart = mongoose.model(collectionName, collectionSchema);
module.exports = Cart;
