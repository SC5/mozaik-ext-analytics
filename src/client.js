var path = require('path');
var fs = require('fs');
var request = require('superagent');
var config  = require('./config');
var Promise = require('bluebird');
var Analyzer = require('./analyzer');
require('superagent-bluebird-promise');

/**
 * @param {Mozaik} mozaik
 */
var client = function (mozaik) {
  mozaik.loadApiConfig(config);

  var keyPath = path.normalize(config.get('analytics.googleServiceKeypath'));

  // Seems absolute/relative?
  if (keyPath.substr(0, 1) !== '/') {
    keyPath = path.join(process.cwd(), keyPath);
  }

  if (!fs.existsSync(keyPath)) {
    mozaik.logger.error('Failed to find analytics .PEM file: %s -- ignoring API', keyPath);
    return {};
  }

  var analyzer = new Analyzer({
    serviceEmail: config.get('analytics.googleServiceEmail'),
    serviceKey: fs.readFileSync(keyPath).toString()
  });

  return {
    pageViews: function(params) {
      mozaik.logger.log('------------------pageviews----');
      console.log('Requesting analyzer statistics:', params);
      return analyzer.getPageViews({
        id: params.id,
        startDate: params.startDate,
        endDate: params.endDate
      });
    },

    topPages: function(params) {
      console.log('Requesting analyzer top pages:', params);
      return analyzer.getTopPages({
        id: params.id,
        dimensions: params.dimensions,
        startDate: params.startDate,
        endDate: params.endDate
      });
    }
  }
}

module.exports = client;
