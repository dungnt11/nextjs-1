const Koa = require("koa");
const route = require("koa-route");
const bodyParser = require("koa-body");
const mongoose = require("mongoose");
const static = require("koa-static");
const path = require("path");

const userController = require("./controller/user.controller");

const app = new Koa();

// catch err
app.on("error", function(err) {
  console.error(err.stack);
  console.log(err.message);
});

// set static folder
const staticPath = "./static";
app.use(static(path.join(__dirname, staticPath)));
app.use(bodyParser());

// controller

/**
 * @Desc router
 */

app.use(route.post("/add", userController.addUser));

/**
 * #####################################################
 */

app.listen(3000, () => {
  console.log("[demo] request post is starting at port 3000");
});

mongoose
  .connect("mongodb://localhost:27017/managerUser", { useNewUrlParser: true })
  .then(() => console.log("connected mongoose"))
  .catch(err => console.error(err));

app.listen(8000, () => console.log("open port"));
