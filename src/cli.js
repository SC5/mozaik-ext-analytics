import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import _ from 'lodash';
import pprint from 'pretty-print';
import Analyzer from './analyzer';
import * as yargs from 'yargs';

dotenv.load();
let env = {
  keyPath: process.env.GOOGLE_SERVICE_KEYPATH,
  profileId: process.env.GOOGLE_ANALYTICS_PROFILE_ID,
  serviceEmail: process.env.GOOGLE_SERVICE_EMAIL
};

let bargs = yargs
  .env('MOZAIK_EXT_ANALYTICS')
  .option('key', {
    alias: 'google-service-keypath'
  })
  .option('email', {
    alias: 'google-service-email',
  })
  .option('id', {
    alias: 'profile-id'
  })
  .usage('Usage: $0 --id [profile-id] --key / --account');

env.keyPath = env.keyPath || bargs.argv.key;

if (!env.keyPath) {
  bargs = bargs.demand(['key']);
}
const argv = bargs.argv;

const serviceKeyPath = path.isAbsolute(env.keyPath) ? env.keyPath : path.join(process.cwd(), env.keyPath);
const analyzer = new Analyzer({
  serviceEmail: env.serviceEmail,
  serviceKey: fs.readFileSync(serviceKeyPath).toString()
});

if (process.env.GOOGLE_ANALYTICS_PROFILE_ID) {
  console.info('Using profile id from environment variables:', env.profileId);
  argv.id = process.env.GOOGLE_ANALYTICS_PROFILE_ID;
}

if (argv.id && !argv.account) {
  analyzer.getTopPages({ id: argv.id })
  //analyzer.getPageViews({ ids: argv.id })
  .then((data) => {
    _.each(data.results, (entry) => {
      // Map entries
      entryObj = _.zipObject(['path', 'views', 'avgTime'], entry);
      console.log('%s: %s', entryObj.path.value, entryObj.views.value);
    });
  })
  .catch((err) => {
    console.warn(err);
  });
}
else {
  // List profile ids
  analyzer.getAccountProfiles()
  .then((profiles) => {
    console.log('Available profiles:\n');
    _.each(profiles, (profile, key) => {
      console.log(profile.name);
      _.each(profile.properties, (prop) => {
        console.log('  ', prop.name);
        _.each(prop.profiles, (profile) => {
          pprint(profile, { leftPadding: 4 });
        });
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });
}
