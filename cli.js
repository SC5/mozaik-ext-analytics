var fs = require('fs');
var path = require('path');
var dotenv = require('dotenv');
var _ = require('lodash');
var pprint = require('pretty-print');
var Analyzer = require('./lib/lib/analyzer');
var argv = require('optimist')
  .usage('Usage: $0 --id [profile-id] / --account')
  .argv;

dotenv.load();

var analyzer = new Analyzer({
  serviceEmail: process.env.GOOGLE_SERVICE_EMAIL,
  serviceKey: fs.readFileSync(path.join(__dirname, process.env.GOOGLE_SERVICE_KEYPATH)).toString()
});

if (process.env.GOOGLE_ANALYTICS_PROFILE_ID) {
  console.info('Using profile id from environment variables:', process.env.GOOGLE_ANALYTICS_PROFILE_ID);
  argv.id = process.env.GOOGLE_ANALYTICS_PROFILE_ID;
}

if (argv.id && !argv.account) {
  analyzer.getTopPages({ id: argv.id })
  //analyzer.getPageViews({ ids: argv.id })
  .then(function(data) {
    _.each(data.results, function(entry) {
      // Map entries
      entryObj = _.zipObject(['path', 'views', 'avgTime'], entry);
      console.log('%s: %s', entryObj.path.value, entryObj.views.value);
    });
  })
  .catch(function(err) {
    console.warn(err);
  });
}
else {
  // List profile ids
  analyzer.getAccountProfiles()
  .then(function(profiles) {
    console.log('Available profiles:\n');
    _.each(profiles, function(profile, key) {
      console.log(profile.name);
      _.each(profile.properties, function(prop) {
        console.log('  ', prop.name);
        _.each(prop.profiles, function(profile) {
          pprint(profile, { leftPadding: 4 });
        });
      });
    });
  })
  .catch(function(err) {
    console.error(err);
  });
}

