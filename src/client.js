import path from 'path';
import fs from 'fs';
import config  from './config';
import Promise from 'bluebird';
import Analyzer from './analyzer';

/**
 * @param {Mozaik} mozaik
 */
const client = (mozaik) => {
  mozaik.loadApiConfig(config);

  // Either key or keyPath is required
  let keyPath = path.normalize(config.get('analytics.googleServiceKeypath'));
  let key = config.get('analytics.googleServiceKey');

  if (!key) {
    // Seems absolute/relative?
    if (!keyPath.match('^\/')) {
      keyPath = path.join(process.cwd(), keyPath);
    }

    if (!fs.existsSync(keyPath)) {
      mozaik.logger.error('Failed to find analytics .PEM file: %s -- ignoring API', keyPath);
      return {};
    }

    key = fs.readFileSync(keyPath).toString();
  }

  const analyzer = new Analyzer({
    serviceEmail: config.get('analytics.googleServiceEmail'),
    serviceKey: key
  });

  const apiMethods = {

    pageViews(params) {
      //console.log('Requesting analyzer statistics:', params);
      return analyzer.getPageViews({
        id: params.id,
        startDate: params.startDate,
        endDate: params.endDate
      });
    },

    topPages(params) {
      //console.log('Requesting analyzer top pages:', params);
      return analyzer.getTopPages({
        id: params.id,
        dimensions: params.dimensions,
        startDate: params.startDate,
        endDate: params.endDate
      });
    }
  };

  return apiMethods;
};

export default client;
