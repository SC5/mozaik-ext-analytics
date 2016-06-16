import test from 'ava';

const mozaikMock = {
  loadApiConfig: () => {},
  logger: {
    log: () => {},
    warn: () => {},
    error: () => {}
  }
};

test('client', t => {
  process.env['GOOGLE_SERVICE_EMAIL'] = 'foo@gmail.com';
  process.env['GOOGLE_SERVICE_KEYPATH'] = './test.pem';
  const client = require('../src/client').default;

  client(mozaikMock)
});
