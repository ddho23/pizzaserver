const Koa = require('koa');
const json = require('koa-json');
const http = require('http');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const actionHandlers = require('../../pizzabot/src/pizza/action-handlers');

const app = new Koa();

app
  .use(logger())
  .use(bodyParser())
  .use(json());

app.use(async (ctx) => {
  try {
    const { result } = ctx.request.body;
    const { action } = result;
  
    if (action === 'RequestPrice') {
      ctx.body = await actionHandlers.requestPrice(result);
    } else if (action === 'RequestPrice.OrderConfirm') {
      ctx.body = await actionHandlers.placeOrder(result);
    } else if (action === 'FindStore') {
      ctx.body = await actionHandlers.findStore(result);
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { err: `${err}` };
  }
});

const server = http.createServer(app.callback()).listen(3000);

module.exports = server;