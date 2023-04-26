const productsController = require('../dao/dbControllers/controller.products')
const cartController = require('../dao/dbControllers/controller.carts')
const messageController = require('../dao/dbControllers/controller.messages')
const userController = require('../dao/dbControllers/controller.users')
const authController = require('../dao/dbControllers/controller.auth')

const router = app => {
  app.use('/api/register', userController)
  app.use('/api/login', authController)
  app.use('/api/products', productsController)
  app.use('/api/carts', cartController) 
  app.use('/api/messages', messageController)
}

module.exports = router