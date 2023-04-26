const productsController = require('../dao/dbManager/controller.products')
const cartController = require('../dao/dbManager/controller.carts')
const messageController = require('../dao/dbManager/controller.messages')
const userController = require('../dao/dbManager/controller.users')
const authController = require('../dao/dbManager/controller.auth')

const router = app => {
  app.use('/api/register', userController)
  app.use('/api/login', authController)
  app.use('/api/dbProducts', productsController)
  app.use('/api/dbCarts', cartController)
  app.use('/api/messages', messageController)
}

module.exports = router