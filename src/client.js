const path   = require('path')
const fs     = require('fs')
const chalk  = require('chalk')
const config = require('./config')
const API    = require('./api')


/**
 * @param {Mozaik} mozaik
 */
const client = mozaik => {
    mozaik.loadApiConfig(config)

    let api

    // Either key or keyPath is required
    let key = config.get('analytics.googleServiceKey')
    if (!key) {
        let keyPath = config.get('analytics.googleServiceKeypath')

        if (!keyPath) {
            mozaik.logger.error(chalk.red('No key or key path defined'))
            process.exit(1)
        }

        try {
            api = API.fromJSON(keyPath)
        } catch (err) {
            mozaik.logger.error(chalk.red('An error occurred while loading key file'))
            process.exit(1)
        }
    } else {
        api = new API(config.get('analytics.googleServiceEmail'), key)
    }

    const operations = {
        pageViews({ id, startDate, endDate }) {
            mozaik.logger.info(chalk.yellow(`[g-analytics] calling page views (${id}, ${startDate}, ${endDate})`))

            return api.getPageViews(id, { startDate, endDate })
        },
        topPages({ id, dimensions, startDate, endDate }) {
            mozaik.logger.info(chalk.yellow(`[g-analytics] calling top pages (${id}, ${startDate}, ${endDate})`))

            return api.getTopPages(id, { dimensions, startDate, endDate })
        }
    }

    return operations
}


module.exports = client
