const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
app.use(morgan("dev"));
const bcrypt = require("bcrypt");

// 設定檔案位置
app.set("views", path.join(__dirname, "/views/html"));
app.use(express.static("./views"));

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser("123456789"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// view engine
const hbs = require("hbs");
app.engine("html", hbs.__express);

hbs.registerPartials(__dirname + "/views/html/layout");
hbs.registerPartials(__dirname + "/views/html/partials");

// // 注册默认layout
// hbs.registerPartials(path.join(__dirname, "views/partials"));
// app.set("view options", { layout: "default" });
// // 注册自定义layout
// hbs.registerPartials(path.join(__dirname, "views/custom-layouts"));
// hbs.registerHelper("customLayout", function(name) {
//   return "layouts/" + name;
// });

hbs.registerHelper("css", function (str, option) {
  let cssList = this.cssList || [];
  str = str.split(/[,，;；]/);
  str.forEach((i) => {
    if (cssList.indexOf(i) < 0) return cssList.push(i);
  });
  this.cssList = cssList.concat();
});

hbs.registerHelper("js", function (str, option) {
  let jsList = this.jsList || [];
  str = str.split(/[,，;；]/);
  str.forEach((i) => {
    if (jsList.indexOf(i) < 0) return jsList.push(i);
  });
  this.jsList = jsList.concat();
});

// 登入
app.get("/admin/login", (req, res) => {
  res.render("init/login.html", { layout: false });
});

app.get("/", (req, res) => {
  res.render("init/index.html", { layout: false });
});

const htmlAdmin = require("./routes/html.admin");
const apiAuth = require("./routes/api.auth");
const apiVol = require("./routes/api.function");
app.use("/admin", htmlAdmin);
app.use("/auth", apiAuth);
app.use("/vol", apiVol);

app.get("*", (req, res) => {
  res.status(404).render("init/404.html", { layout: false });
});

app.listen(8000, () => console.log("Server is running!"));
