import Promise from 'bluebird';
import googleapis from 'googleapis';
import _ from 'lodash';

const analytics = googleapis.analytics('v3');

/**
 * Analyzer class for communicating with Analytics via googleapis
 * @param {object} opts Options { serviceEmail: 'googleemail', serviceKey: 'pemkeycontents..' }
 */
class Analyzer {
  constructor(opts) {
    this.jwtClient = new googleapis.auth.JWT(
      opts.serviceEmail, null, opts.serviceKey, [
        'https://www.googleapis.com/auth/analytics',
        'https://www.googleapis.com/auth/analytics.readonly'
      ]
    );
  }

  authorize() {
    return new Promise((resolve, reject) => {
      this.jwtClient.authorize((err, tokens) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve({ client: this.jwtClient, tokens: tokens });
      });
    });
  }

  /**
   * Internal method for making requests to Analytics
   * @param  {obj} params All the params
   * @param  {function} parseFunc optional function to parse some of the data
   * @param  {function} apiFunc optional alternative function to call in request
   * @return {Promise}        Promise
   */
  request(params, parseFunc, apiFunc) {
    apiFunc = apiFunc || analytics.data.ga.get;

    return this.authorize()
    .then((auth) => {
      return new Promise((resolve, reject) => {
        params.auth = auth.client;
        apiFunc(params, (err, body) => {
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
  }

  // Ensure the given id is prefixed with ga:
  prefixId(id = required()) {
    return (id || '').toString().match(/^ga:/) ? id : `ga:${id}`;
  }

  mapRequestResponse(res) {
    res.results = _.chain(res.rows)
      .map((row) => {
        return _.chain(row)
          .map((val, index) => {
            return { value: val, col: res.columnHeaders[index] };
          })
          .flatten()
          .value();
       })
      .value();
    return res;
  }

  getAccountProfiles(opts) {
    opts = opts || {};
    var params = {
      'fields': 'items(name,webProperties(name,profiles(id,name)))'
    }
    const parseFunc = (res) => {
      return _.chain(res.items)
        .map((item) => {
          return {
            name: item.name,
            properties: _.chain(item.webProperties)
              .map((webPro) => {
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
    return this.request(params, parseFunc, analytics.management.accountSummaries.list);
  }

  getTopPages(opts = {}) {
    var params = {
      'dimensions': 'ga:pagePath',
      'ids': this.prefixId(opts.id),
      'start-date': opts.startDate || '30daysAgo',
      'end-date': opts.endDate || 'yesterday',
      'max-results': opts.maxResults || 10,
      'sort': '-ga:pageviews',
      'metrics': 'ga:pageviews,ga:avgTimeOnPage'
    };

    return this.request(params, this.mapRequestResponse);
  }

  getPageViews(opts = {}) {
    opts = opts || {};
    var params = {
      'ids': this.prefixId(opts.id),
      'start-date': opts.startDate || '7daysAgo',
      'end-date': opts.endDate || 'yesterday',
      'metrics': 'ga:pageviews,ga:sessions',
      'dimensions': 'ga:date'
    }

    return this.request(params, this.mapRequestResponse);
  }

}

function required() {
  throw new Error('Missing required value');
}

export default Analyzer;
