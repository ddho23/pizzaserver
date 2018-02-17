
describe('Test koa server', () => {
  it('Server should run', () => {
    const server = require('../src/index');

    server.close();
  });

})