const app = require('./app')
const httpServer = require('http').createServer(app)
const socketIo = require('./socket')
const io = socketIo(httpServer)
const { PORT } = require('./config/app.config')


app.locals.io = io

httpServer.listen(PORT, () => {
  console.log(`server running at port ${PORT}`)
})
