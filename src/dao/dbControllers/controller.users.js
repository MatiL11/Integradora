const { Router } = require("express");
const Users = require("../models/Users.model");
const Cart = require("../models/Carts.model");
const passport = require("passport");

const router = Router();

router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "register/failresgister",
  }),
  async (req, res) => {
    try {
      const newUser = req.user;
      res.status(201).json({ status: "success", message: newUser });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: "error", error: "Error interno del servidor" });
    }
  }
);

router.get("/", (req, res) => {
  try {
    res.render("register.handlebars");
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.get("/failregister", (req, res) => {
  console.log("falló estrategia de registro!");

  res.json({ error: "Registro fallido" });
});

module.exports = router;
