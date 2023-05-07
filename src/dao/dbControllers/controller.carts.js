const { Router } = require("express");
const mongoose = require("mongoose");
const Cart = require("../models/Carts.model");
const Products = require("../models/Products.model");
const privateAccess = require("../../middlewares/privateAccess.middleware");
const router = Router();

// crear un carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({});
    console.log("Carrito creado:", newCart);
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

// mostrar un carrito por id
router.get("/:cid", privateAccess, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate(
      "productos.product"
    );
    res.status(200).render("carts.handlebars", { cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting cart" });
  }
});

//Agregar un producto en un carrito
router.post("/:cartId/:productId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cartId });
    const product = await Products.findOne({ _id: req.params.productId });
    if (!product) throw new Error("Product not found");

    const itemIndex = cart.productos.findIndex(
      (item) => item.product._id.toString() === req.params.productId
    );
    if (itemIndex !== -1) {
      cart.productos[itemIndex].quantity += 1;
    } else {
      cart.productos.push({
        product: req.params.productId,
        quantity: 1,
      });
    }

    await cart.save();
    res.json({ message: "Product added to cart", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error adding product to cart" });
  }
});

//actualizar el carrito con un arreglo
router.put("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = req.body.productos;
    await cart.save();
    res.json({ message: "Carrito actualizado", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error actualizando el carrito" });
  }
});

// actualizar solo la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const item = cart.productos.find((item) => item.product == req.params.pid);
    if (!item) throw new Error("Product not found in cart");
    item.quantity = req.body.quantity;
    await cart.save();
    res.json({ message: "Carrito actualizado", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error actualizando el carrito" });
  }
});

// borrar un producto seleccionado
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cid });
    const productIndex = cart.productos.findIndex((item) =>
      item.product.equals(new mongoose.Types.ObjectId(req.params.pid))
    );
    if (productIndex === -1) throw new Error("Producto no encontrado");
    cart.productos.splice(productIndex, 1);
    await cart.save();
    res.json({ message: "El producto fue eliminado del carrito", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error eliminando el producto" });
  }
});

// borrar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = [];
    await cart.save();
    res.json({
      message: "Todos los productos fueron eliminados del carrito",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar los productos" });
  }
});

module.exports = router;
