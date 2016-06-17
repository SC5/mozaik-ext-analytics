import proxyquire from 'proxyquire';
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
  // Mock the fs checks
  const client = proxyquire('../src/client', {
    fs: {
      existsSync: () => true,
      readFileSync: () => 'foo'
    }
  }).default;

  t.truthy(client(mozaikMock).pageViews);
});
