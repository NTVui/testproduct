const express = require('express')
const path = require('path');
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const database = require('./config/database')
const moment = require("moment-timezone");

require('dotenv').config()

const route = require('./routes/client/index-route')
const routeAdmin = require('./routes/admin/index-route')
const systemConfig = require('./config/system')

database.connect()

const app = express()
const port = process.env.PORT

app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//Tìm hiểu dirname là gì
//Có thể là cấu trúc thư mục
console.log(__dirname)

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
app.use(express.static(`${__dirname}/public`))

//Express-flash
app.use(cookieParser('keytutao'))
app.use(session({ cookie: { maxAge: 60000 } }))
app.use(flash())

app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment

route(app)
routeAdmin(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
