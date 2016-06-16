import test from 'ava';
import Analyzer from '../src/analyzer';

test('prefixId', t => {
  const analyzer = new Analyzer({
    serviceEmail: 'foo',
    serviceKey: 'bar'
  });

  t.is(analyzer.prefixId('foo'), 'ga:foo');
  t.is(analyzer.prefixId('ga:foo'), 'ga:foo');
  t.throws(analyzer.prefixId, null, 'expecting to get error when no param');
});
