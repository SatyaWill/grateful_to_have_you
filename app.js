const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan');
app.use(morgan('dev'));
const bcrypt = require("bcrypt")

// 設定檔案位置
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('./public')); 

const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
app.use(cookieParser('123456789'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
// view engine
const hbs = require("hbs");
app.engine("html" , hbs.__express);

// 登入
app.get("/admin/login" , (req,res)=>{
  res.render("login.html");
});

const htmlAdmin = require("./routes/html.admin")
const apiAuth = require("./routes/api.auth")
const apiVol = require("./routes/api.function")
app.use("/admin", htmlAdmin)
app.use("/auth", apiAuth)
app.use("/vol", apiVol)

app.get('*', (req, res) => {
  res.status(404).render("404.html");
});

app.listen(8000, ()=>console.log("Server is running!"));
