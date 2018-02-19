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
    "speech": "PLACEHOLDER_FOR_PERMISSION",
    "contextOut": [],
    "data": {
      "google": {
        "expectUserResponse": true,
        'isSsml': false,
        'richResponse': {
          'items': [
            {
              'simpleResponse': {
                'textToSpeech': 'Need your location',
                'displayText': 'Need your location'
              }
            }
          ],
        },
        'systemIntent': {
          "intent": "actions.intent.PERMISSION",
          "data": {
            "@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
            "optContext": "To deliver your order",
            "permissions": [
              "NAME",
              "DEVICE_PRECISE_LOCATION"
            ]
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
  

    if (action == 'FindStore') {
      ctx.body = getLocationPermission();
    } else if (action === 'found_location') {
      const location = ctx.request.body.originalRequest.data.device.location;
      console.log(location);
      ctx.body = {
        speech: 'Got your location',
        displayText: JSON.stringify(location),
      }
    }
    

    // if (action === 'RequestPrice') {
    //   ctx.body = await actionHandlers.requestPrice(result);
    // } else if (action === 'RequestPrice.OrderConfirm') {
    //   ctx.body = await actionHandlers.placeOrder(result);
    // } else if (action === 'FindStore') {
    //   ctx.body = await actionHandlers.findStore(result);
    // }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { err: `${err}` };
  }

  await next();
});

const server = http.createServer(app.callback()).listen(3000);

module.exports = server;