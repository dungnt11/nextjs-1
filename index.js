const logger = require("koa-logger");
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-body");
const static = require("koa-static");

const mongoose = require("mongoose");
const path = require("path");
const cors = require("koa2-cors");

// controller
const userController = require("./controller/user.controller");

const app = new Koa();
const router = new Router();
// logger request
app.use(logger());
// body
app.use(bodyParser({ multipart: true }));
//cors
app.use(cors());

// set static folder
app.use(static("."));
const staticPath = "./static";
const uploads = "./uploads";
app.use(static(path.join(__dirname, staticPath)));
app.use(static(path.join(__dirname, uploads)));

/**
 * @Route POST /add
 * @POST_content { name: String, avatar: file, age: String | number }
 */
router.post("/add", userController.addUser);

/**
 * @Route PUT /edit
 * @PUT_content { name: String, avatar: file, age: String | number }
 */
router.put("/edit/:id", userController.editUser);
router.get("/get", userController.getUser);
router.get("/user/:id", userController.getUserById);

app.use(router.routes()).use(router.allowedMethods());

/**
 * #####################################################
 */

// custom 404
app.use(async function(ctx, next) {
  await next();
  if (ctx.body || !ctx.idempotent) {
    ctx.body = { msg: "Page not found !" };
  }
});

// catch err
app.on("error", function(err) {
  console.error(err.stack);
  console.log(err.message);
});

mongoose
  .connect("mongodb://localhost:27017/managerUser", { useNewUrlParser: true })
  .then(() => console.log("connected mongoose"))
  .catch(err => console.error(err));

app.listen(8000, () => console.log("open port"));
