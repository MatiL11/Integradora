const { Router } = require('express')
const productManager = require('../productManager')
const router = Router()


// muestra todos los productos
router.get('/', (req, res) => {
  const limite = parseInt(req.query.limit)
  try {
    const productos = productManager.getProducts(limite)
    res.status(200).render('home.handlebars', { productos })
  } catch (error) {
    console.error(error)
    res.status(500).send({error:`error al cargar los productos`})
  }
})


// muestra un producto por id
router.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid)
  try {
    const product = productManager.getProductById(productId)
    res.status(200).send({ product})
  } catch (error) {
    console.error(error)
    res.status(404).send({message: `producto ${productId} no encontrado`})
  }
})

// actualiza un producto por id
router.patch('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid)
  const updates = req.body
  try {
    const updateProduct = productManager.updateProduct(productId, updates)
    io.emit('productos', productManager.getProducts())
    res.status(200).send({updateProduct})
  } catch (error) {
    console.error(error)
    res.status(400).send({message: `error al actualizar ru producto, verifica los valores enviados por body`})
  }
})

module.exports = router
