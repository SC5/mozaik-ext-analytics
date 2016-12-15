const path       = require('path')
const googleapis = require('googleapis')
const _          = require('lodash')
const analytics  = googleapis.analytics('v3')


/**
 * API class for communicating with Analytics via googleapis.
 */
class API {
    /**
     * @constructor
     * @param {string} email
     * @param {string} privateKey
     */
    constructor(email, privateKey) {
        this.jwtClient = new googleapis.auth.JWT(
            email,
            null,
            privateKey,
            API.scopes
        )
    }

    authorize() {
        return new Promise((resolve, reject) => {
            this.jwtClient.authorize((err, tokens) => {
                if (err) {
                    console.error(err)

                    return reject(err)
                }

                resolve({ client: this.jwtClient, tokens })
            });
        });
    }

    /**
     * Internal method for making requests to Analytics.
     *
     * @param  {function} method      - Optional alternative function to call in request
     * @param  {object}   params      - Params to provide to the method
     * @param  {function} [transform] - Optional function to parse/transform received data
     * @return {Promise} Promise
     */
    request(method, params, transform) {
        return this.authorize().then(auth => {
            return new Promise((resolve, reject) => {
                method(Object.assign({}, params, { auth: auth.client }), (err, body) => {
                    if (err) {
                        console.error(err)

                        return reject(err)
                    }

                    if (transform) return resolve(transform(body))

                    return resolve(body)
                })
            })
        })
    }

    // Ensure the given id is prefixed with ga:
    prefixId(id) {
        return (id || '').toString().match(/^ga:/) ? id : `ga:${id}`;
    }

    mapRequestResponse(res) {
        res.results = _.chain(res.rows)
            .map(row => _.chain(row)
                .map((val, index) => ({
                    value: val,
                    col:   res.columnHeaders[index],
                }))
                .flatten()
                .value()
            )
            .value()

        return res
    }

    getAccountProfiles() {
        const params = {
            fields: 'items(name,webProperties(name,profiles(id,name)))'
        }

        const transform = res => {
            return _.chain(res.items)
                .map(({ name, webProperties }) => {
                    return {
                        name,
                        properties: _.chain(webProperties).map(({ name, profiles }) => ({ name, profiles })).value(),
                    }
                })
                .flatten()
                .flatten()
                .value()
        }

        // Retrieve summary info and pick the relevant info from it
        return this.request(analytics.management.accountSummaries.list, params, transform);
    }

    getTopPages(id, opts = {}) {
        const params = {
            'ids':         this.prefixId(id),
            'start-date':  opts.startDate  || '30daysAgo',
            'end-date':    opts.endDate    || 'yesterday',
            'max-results': opts.maxResults || 10,
            'dimensions':  'ga:pagePath',
            'metrics':     'ga:pageviews,ga:avgTimeOnPage',
            'sort':        '-ga:pageviews',
        }

        return this.request(analytics.data.ga.get, params, this.mapRequestResponse);
    }

    getPageViews(id, opts = {}) {
        const params = {
            'ids':        this.prefixId(id),
            'start-date': opts.startDate || '7daysAgo',
            'end-date':   opts.endDate   || 'yesterday',
            'dimensions': 'ga:date',
            'metrics':    'ga:pageviews,ga:sessions',
        }

        return this.request(analytics.data.ga.get, params, this.mapRequestResponse)
    }

    getBrowserInfo(id, opts = {}) {
        const params = {
            'ids':        this.prefixId(id),
            'start-date': opts.startDate || '7daysAgo',
            'end-date':   opts.endDate   || 'yesterday',
            'dimensions': 'ga:browser,ga:browserVersion',
            'metrics':    'ga:sessions',
            'sort':       'ga:browser',
        }

        return this.request(analytics.data.ga.get, params, this.mapRequestResponse)
            .then(data => {
                return {
                    query:        data.query,
                    totalResults: data.totalResults,
                    totals:       _.chain(data.totalsForAllResults)
                        .mapKeys((v, k) => k.slice(3))
                        .mapValues(Number)
                        .value()
                    ,
                    results:      data.results.map(entry => _(entry)
                        .keyBy(o => o.col.name.slice(3))
                        .mapValues((o, k) => {
                            const v = o.value
                            if (k === 'sessions') return Number(v)
                            return v
                        })
                        .value()
                    ),
                }
            })
    }
}

/**
 * Required scopes.
 *
 * @type {Array<string>}
 */
API.scopes = [
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.readonly',
]

/**
 * Instantiate a new API client from given JSON service key file.
 *
 * @param {string} _jsonPath - path to the json service key file
 * @return {API}
 */
API.fromJSON = _jsonPath => {
    const jsonPath = path.isAbsolute(_jsonPath) ? _jsonPath : path.join(process.cwd(), _jsonPath)
    const key      = require(jsonPath)

    return new API(key.client_email, key.private_key)
}


module.exports = API
