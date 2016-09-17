import test from 'ava';
import proxyquire from 'proxyquire';
proxyquire.noPreserveCache();

const configKeyValues = {
  'analytics.googleServiceEmail': 'foo@gmail.com',
  'analytics.googleServiceKeypath': null,
  'analytics.googleServiceKey': 'fooobar'
};

// Mock the config
const configMock = proxyquire('../src/config', { convict: () => {
  return {
    get: (name) => { return configKeyValues[name]; }
  };
}});

const mozaikMock = {
  loadApiConfig: () => {},
  logger: {
    log: () => {},
    warn: () => {},
    error: () => {}
  }
};

test('client', t => {
  process.env.GOOGLE_SERVICE_EMAIL = 'foo@gmail.com';
  process.env.GOOGLE_SERVICE_KEYPATH = './test.pem';
  // Mock the fs checks
  const client = proxyquire('../src/client', {
    fs: {
      existsSync: () => true,
      readFileSync: () => 'foo'
    }
  }).default;

  t.truthy(client(mozaikMock).pageViews);
});

test('client key', t => {
  const client = proxyquire('../src/client', {
    './config': configMock
  }).default;

  t.truthy(client(mozaikMock).pageViews);
});
