const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoConnect = require('../db')
const router = require('./routers')
const handlebars = require('express-handlebars');




app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
      "mongodb+srv://admin:admin@coder.n7ppfjp.mongodb.net/Sessions?retryWrites=true&w=majority",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);

app.engine('handlebars', handlebars.engine());
app.set('views',__dirname + '/views')


mongoConnect()
router(app)




module.exports = app
