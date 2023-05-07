const { Router } = require("express");
const Products = require("../models/Products.model");
const Cart = require("../models/Carts.model");
const uploader = require("../../utils/multer.utils");
const router = Router();
const privateAccess = require("../../middlewares/privateAccess.middleware");
const buscarProducto = require("../products.dao");

router.get("/", privateAccess, async (req, res) => {
  try {
    const user = req.session.user;
    const message = user
      ? `Bienvenido ${user.role} ${user.first_name} ${user.last_name}!`
      : null;
    const cart = await Cart.findOne({ userId: user._id });
    const cartId = cart._id.toString();
    const products = await buscarProducto(req, message, cartId);
    res.render("products.handlebars", products);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

router.post("/", uploader.single("file"), async (req, res) => {
  try {
    const newProduct = await Products.create(req.body);
    res.json({ message: newProduct });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:productId", async (req, res) => {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    res.json({
      message: "Producto actualizado",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error actualizando el producto" });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    const deletedProduct = await Products.findByIdAndDelete(
      req.params.productId
    );

    res.json({
      message: `El producto ${deletedProduct} con id ${req.params.productId} fue eliminado`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error eliminando el producto" });
  }
});

module.exports = router;
