const asyncBusboy = require("async-busboy");

module.exports = async (ctx, next) => {
  const { fields } = await asyncBusboy(ctx.req);
  ctx.body  = "xin chao"
};
