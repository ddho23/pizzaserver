const Koa = require('koa');
const app = new Koa();

const actionHandlers = require('../../pizzabot/src/pizza/action-handlers');

app.use(async (ctx) => {
  try {
    const result = actionHandlers.getResult(req);
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
    ctx.body = { err };
  }
});

app.listen(3000);