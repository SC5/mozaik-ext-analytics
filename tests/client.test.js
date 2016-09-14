import test from 'ava';
import proxyquire from 'proxyquire';

// Ensure we don't get any module from the cache
proxyquire.noPreserveCache();

function getMock() {

}

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
  const configKeyValues = {
    'analytics.googleServiceEmail': 'foo@gmail.com',
    'analytics.googleServiceKeypath': null,
    'analytics.googleServiceKey': 'fooobar'
  };

  // Mock the config
  // FIXME: proxyquire is not mocking as expected
  /*
  const client = proxyquire('../src/client', {
    './config': {
      get: (name) => { configKeyValues[name]; }
    }
  }).default;

  t.truthy(client(mozaikMock).pageViews);
  */
});
