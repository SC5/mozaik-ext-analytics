var Promise = require('bluebird');
var googleapis = require('googleapis');
var _ = require('lodash');
var analytics = googleapis.analytics('v3');

/**
 * Analyzer class for communicating with Analytics via googleapis
 * @param {object} opts Options { serviceEmail: 'googleemail', serviceKey: 'pemkeycontents..' }
 */
function Analyzer(opts) {
  this.jwtClient = new googleapis.auth.JWT(
    opts.serviceEmail, null, opts.serviceKey, [
      'https://www.googleapis.com/auth/analytics',
      'https://www.googleapis.com/auth/analytics.readonly'
    ]
  );
};

Analyzer.prototype.authorize = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.jwtClient.authorize(function(err, tokens) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve({ client: self.jwtClient, tokens: tokens });
    });
  });
};

/**
 * Internal method for making requests to Analytics
 * @param  {obj} params All the params
 * @param  {function} parseFunc optional function to parse some of the data
 * @param  {function} apiFunc optional alternative function to call in request
 * @return {Promise}        Promise
 */
Analyzer.prototype.request = function(params, parseFunc, apiFunc) {
  var self = this;
  apiFunc = apiFunc || analytics.data.ga.get;

  return self.authorize()
    .then(function(auth) {
      return new Promise(function(resolve, reject) {
        params.auth = auth.client;
        apiFunc(params, function(err, body) {
          if (err) {
            return reject(err);
          }
          if (parseFunc) {
            return resolve(parseFunc(body));
          }
          return resolve(body);
        });
      });
    });
};


Analyzer.prototype.prefixId = function(id) {
  if (id === undefined) {
    console.warn('Given id is empty');
    return;
  }

  id = id || '';
  id = id.toString();

  // Start with 'ga:'?
  if (id.substr(0,3) !== 'ga:') {
    id = 'ga:' + id;
  }

  return id;
};

Analyzer.prototype.mapRequestResponse = function(res) {
  res.results = _.chain(res.rows)
    .map(function(row) {
      return _.chain(row)
        .map(function(val, index) {
          return { value: val, col: res.columnHeaders[index] };
        })
        .flatten()
        .value();
    })
    .value();
  return res;
};

Analyzer.prototype.getAccountProfiles = function(opts) {
  opts = opts || {};
  var self = this;
  var params = {
    'fields': 'items(name,webProperties(name,profiles(id,name)))'
  }
  var parseFunc = function(res) {
    return _.chain(res.items)
      .map(function(item) {
        return {
          name: item.name,
          properties: _.chain(item.webProperties)
            .map(function(webPro){
              return { name: webPro.name, profiles: webPro.profiles };
            })
            .value()
        };
      })
      .flatten()
      .flatten()
      .value();
  };

  // Retrieve summary info and pick the relevant info from it
  return self.request(params, parseFunc, analytics.management.accountSummaries.list);
};

Analyzer.prototype.getTopPages = function(opts) {
  opts = opts || {};
  var self = this;
  var params = {
    'dimensions': opts.dimensions || 'ga:pagePath',
    'ids': self.prefixId(opts.id),
    'start-date': opts.startDate || '30daysAgo',
    'end-date': opts.endDate || 'yesterday',
    'max-results': opts.maxResults || 10,
    'sort': '-ga:pageviews',
    'metrics': 'ga:pageviews,ga:avgTimeOnPage'
  }

  return self.request(params, self.mapRequestResponse);
};

Analyzer.prototype.getPageViews = function(opts) {
  opts = opts || {};
  var self = this;
  var params = {
    'ids': self.prefixId(opts.id),
    'start-date': opts.startDate || '7daysAgo',
    'end-date': opts.endDate || 'yesterday',
    'metrics': 'ga:pageviews,ga:sessions',
    'dimensions': 'ga:date'
  }

  return self.request(params, self.mapRequestResponse);
};

module.exports = exports = Analyzer;