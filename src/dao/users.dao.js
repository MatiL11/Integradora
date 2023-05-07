const Users = require("./models/Users.model");
const Cart = require("./models/Carts.model");

async function usersCreate(userInfo) {
  try {
    const { first_name, last_name, email, age, password } = userInfo;

    let role = "usuario";
    if (email === "admin@gmail.com" && password === "admin") {
      role = "administrador";
    }

    const newUserInfo = {
      first_name,
      last_name,
      email,
      age,
      password,
      role,
    };

    const user = await Users.create(newUserInfo);

    const cart = new Cart({
      userId: user._id,
    });

    await cart.save();

    return user;
  } catch (error) {
    return error;
  }
}

module.exports = { usersCreate };
