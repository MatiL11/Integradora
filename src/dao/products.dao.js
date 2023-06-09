const Products = require("./models/Products.model");
const Cart = require("./models/Carts.model");

async function productSearch(req, message, cartId) {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort =
    req.query.sort === "asc"
      ? "desc"
      : req.query.sort === "mayor"
      ? "menor"
      : null;
  const query = req.query.query
    ? {
        $and: [
          {
            $or: [
              { name: { $regex: new RegExp(req.query.query, "i") } },
              { description: { $regex: new RegExp(req.query.query, "i") } },
            ],
          },
          {
            category: {
              $regex: req.query.category || "",
              $options: "i",
            },
          },
        ],
      }
    : { category: { $regex: req.query.category || "", $options: "i" } };
  try {
    const cart = await Cart.findById(cartId);
    const products = await Products.paginate(query, {
      limit: limit,
      page: page,
      sort: sort,
    });
    const totalPages = products.totalPages;
    const prevPage = products.prevPage;
    const nextPage = products.nextPage;
    const currentPage = products.page;
    const hasPrevPage = products.hasPrevPage;
    const hasNextPage = products.hasNextPage;
    const prevLink = hasPrevPage
      ? `http://${req.headers.host}/api/dbProducts?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}`
      : null;
    const nextLink = hasNextPage
      ? `http://${req.headers.host}/api/dbProducts?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}`
      : null;

    const numProdCart = cart.productos.length;
    const productList = {
      title: "Lista de Productos",
      products: products.docs,
      cartId: cartId,
      cartQuantity: numProdCart,
      message: message,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: currentPage,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    };

    return productList;
  } catch (error) {
    return error;
  }
}

module.exports = productSearch;
