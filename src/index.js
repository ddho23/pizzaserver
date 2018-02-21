const Koa = require('koa');
const json = require('koa-json');
const http = require('http');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const DialogflowApp = require('actions-on-google').DialogflowApp;

const actionHandlers = require('../../pizzabot/src/pizza/action-handlers');

const app = new Koa();

app
  .use(logger())
  .use(bodyParser())
  .use(json());

function getLocationPermission() {
  return {
    speech: 'PLACEHOLDER',
      data: {
        google: {
          expectUserResponse: true,
          isSsml: false,
          richResponse: {
            items: [{ simpleResponse: { textToSpeech: 'PLACEHOLDER' } }],
          },
          systemIntent: {
            intent: 'actions.intent.PERMISSION',
            data: {
              '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
              optContext: 'To deliver your order',
              permissions: [ 'DEVICE_PRECISE_LOCATION' ]
            }
          }
        }
      }
    };
};

app.use(async (ctx, next) => {
  try {
    const result = ctx.request.body.result;
    const { action } = result;

    if (action === 'RequestPrice') {
      ctx.body = await actionHandlers.requestPrice(result);
    } else if (action === 'RequestPrice.OrderConfirm') {
      ctx.body = await actionHandlers.placeOrder(result);
    } else if (action == 'FindLocation') {
      ctx.body = await actionHandlers.findLocation();
    } else if (action === 'FindStore') {
      ctx.body = await actionHandlers.findStore(ctx.request.body);
    }

  } catch (err) {
    ctx.status = 500;
    ctx.body = { err: `${err}` };
  }

  await next();
});

const server = http.createServer(app.callback()).listen(3000);

module.exports = server;