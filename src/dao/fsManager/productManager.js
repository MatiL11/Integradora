const fs = require('fs')
//decidi utilizar el metodo joi para validar los datos de los productos
const Joi = require('joi')
const ruta = 'src/data/Productos.json'




class ProducManager{
  constructor(path){
    this.path = path
  }

  addProduct(product) {
    const schema = Joi.object({
      nombre: Joi.string().required(),
      descripcion: Joi.string().required(),
      price: Joi.number().min(0).required(),
      img: Joi.array().optional(),
      code: Joi.string().required(),
      category: Joi.string().required(),
      status: Joi.boolean().required(),
      stock: Joi.number().min(0).required(),
    })
    const {error} = schema.validate(product)
    if (error) {
      throw new Error(error.details[0].message)
    }


    const data = fs.readFileSync(this.path)
    const products = JSON.parse(data)

    const id = products.length + 1
    const newProduct = product
    newProduct["id"] = id
    products.push(newProduct)

    try {
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
      console.log(`producto ${id} agregado`)
      return products
    } catch (error) {
      console.error('error al escribir el archivo',error)
      throw new Error(`no se pudo agregar el producto ${id}`)
    }
  }

  getProducts(limit){
    try {
      const productos = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
      if(limit){
        return productos.slice(0, limit)
      }else{
        return productos
      }
    }catch(error){
      console.error(error)
      throw new Error(`error al cargar los productos`)
    }
  }

  getProductById(id){
    try {
      const producto = JSON.parse(fs.readFileSync(this.path, 'utf8'))
      const productoId = producto.find(product => product.id === id)
      return productoId
    }catch(error){
      console.error(error)
      throw new Error(`error al cargar el producto ${id} verifica que exista`)
    }
  }

  updateProduct(id, updates){

    try {
      const data = fs.readFileSync(this.path, 'utf-8')
      const productos = JSON.parse(data)
      const index = productos.findIndex(producto => producto.id === id)

      if(index === -1){
        throw new Error(`producto ${id} no encontrado`)
      }

      productos[index] = {
        ...productos[index],
        ...updates
      }

      fs.writeFileSync(this.path, JSON.stringify(productos));
      console.log(`producto ${id} actualizado`);

    } catch (error) {
      console.error(error)
      throw new Error(`error al actualizar tu producto ${id}, verifica que tus valores a actualizar sean validos`)
    }
  }

  deleteProduct(id){
    try {
      const productos = JSON.parse(fs.readFileSync(this.path, 'utf-8',))
      const index = productos.findIndex(producto => producto.id === id)


      if(index !== -1){
        productos.splice(index, 1)
        fs.writeFileSync(this.path, JSON.stringify(productos, null, 2))
        console.log(`producto ${id} eliminado`)
      }
    } catch (error) {
      console.error(error)
      throw new Error(`error al eliminar el producto ${id}`)
    }
  }

  deleteAllProducts(){
    try {
      fs.unlinkSync(this.path)
      console.log("todos los productos se han eliminado con exito")
    } catch (error) {
      console.error(error)
      throw new Error(`error al eliminar los productos`)
    }
  }
}


const productManager = new ProducManager(ruta)
module.exports = productManager

