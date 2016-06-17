import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import _ from 'lodash';
import pprint from 'pretty-print';
import Analyzer from './analyzer';
import * as optimist from 'optimist'

const argv = optimist.usage('Usage: $0 --id [profile-id] / --account').argv;
dotenv.load();

const analyzer = new Analyzer({
  serviceEmail: process.env.GOOGLE_SERVICE_EMAIL,
  serviceKey: fs.readFileSync(path.join(process.cwd(), process.env.GOOGLE_SERVICE_KEYPATH)).toString()
});

if (process.env.GOOGLE_ANALYTICS_PROFILE_ID) {
  console.info('Using profile id from environment variables:', process.env.GOOGLE_ANALYTICS_PROFILE_ID);
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
