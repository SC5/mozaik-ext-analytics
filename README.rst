mozaik-ext-analytics
====================
Module provides some Google Analytics widgets for Mozaïk dashboard.

.. contents::
    :local:

Setup
-----

#.  Install dependencies::

      npm install mozaik-ext-analytics

#.  Register client api by adding to dashboard ``app.js``::

      mozaik.bus.registerApi('analytics', require('mozaik-ext-analytics/client'));

#.  Register widgets by adding to dashboard ``src/App.jsx``::

      mozaik.addBatch('analytics', require('mozaik-ext-analytics'));

#.  Build the dashboard::

      gulp publish

#.  Setup Google Analytics

    #.  Login to Developers Console: https://console.developers.google.com/
        (register Google account if you don't already have one)

    #.  Create new project ``dashboard`` (or similar)

    #.  Enable following ``Analytics API`` from permissions

    #.  Create *Service account* under Credentials:
        Create new Client ID -> Service account -> Download mozaik-ext-analytics.p12 file

    #.  Convert .p12 file into .pem format with command::

          openssl pkcs12 -in mozaik-ext-analytics*.p12 -nodes -nocerts > mozaik-ext-analytics.pem

        The password for .p12 file is ``notasecret``

    #.  Authorize service user to acces analytics *property* in question by adding the service
        email address via User Management

    #.  Configure service auth details in dashboard root file: ``.env`` (or as environment variables)::

          GOOGLE_SERVICE_EMAIL=generated-by-google-console@developer.gserviceaccount.com
          GOOGLE_SERVICE_KEYPATH=mozaik-ext-analytics.pem

        Alternatively use `export` command to set environment variables.

    #.  Run command line app to retrieve ids (or see them from analytics - see references)::

          node node_modules/mozaik-ext-analytics/cli.js

        **OR**

        - `Navigate to Analytics api explorer <https://developers.google.com/apis-explorer/#p/analytics/v3/analytics.management.accountSummaries.list?_h=2&>`_
        - Authorize request from OAuth 2.0 button in top-right corner
        - Select the wanted id from wanted `profiles[n].id` field

#.  Configure dashboard ``config.js``::

      module.exports = {
        // Configure api
        api: {
          analytics: {
            googleServiceEmail: process.env.GOOGLE_SERVICE_EMAIL,
            googleServiceKeypath: process.env.GOOGLE_SERVICE_KEYPATH
          },
          // Other services ...
        },

        // Set widgets
        dashboards: [
          columns: 2,
          rows: 2,
          // See next sections for details
          widgets: [
            {
              type: 'analytics.page_views',
              id: '123123123',
              startDate: '30daysAgo',
              columns: 2, rows: 2,
              x: 0, y: 0
            }
          ]
        ]
      }

#.  Start the dashboard::

      node app.js


Widget: analytics.page_views
----------------------------
Draw line diagram to show amount of page views between defined time range.

Params
  ==========  ========  =======================
  Name        Required  Description
  ==========  ========  =======================
  id          Yes       Id of the analytics data to show. See setup steps or analytics view for more info. Example: `1231234321`
  startDate   No        Starting date info used in Analytics. Example/default: '30daysAgo'
  endDate     No        Ending date info used in Analytics. Example/default: 'yesterday'
  title       No        Textual title to show. Example: 'Homepage'.
  ==========  ========  =======================

Example:
  .. code::

    {
      type: 'analytics.page_views',
      id: '123123123',
      startDate: '30daysAgo',
      columns: 2, rows: 1,
      x: 1, y: 0
    },


Widget: analytics.top_pages
---------------------------
Show list of pages, in order of most visits within given time range.

Params
  ==========  ========  =======================
  Name        Required  Description
  ==========  ========  =======================
  id          Yes       Id of the analytics data to show. See setup steps or analytics view for more info.
  startDate   No        Starting date info used in Analytics. Example/default: '30daysAgo'
  endDate     No        Ending date info used in Analytics. Example/default: 'yesterday'
  title       No        Textual title to show. Example: 'Homepage'.
  ==========  ========  =======================

Example:
  .. code::

    {
      type: 'analytics.top_pages',
      id: '123123123',
      startDate: '30daysAgo',
      columns: 2, rows: 1,
      x: 1, y: 0
    },

License
-------
Distributed under the MIT license

Credit
------
The module is backed by `SC5 <http://www.sc5.io/>`_

References
----------
- `Analytics metrics reference <https://developers.google.com/analytics/devguides/reporting/core/dimsmets#mode=web>`_
- `Analytics profile/table ids <https://developers.google.com/apis-explorer/#p/analytics/v3/analytics.management.accountSummaries.list?_h=2>`_
- `Example query <https://developers.google.com/apis-explorer/#p/analytics/v3/analytics.data.ga.get?ids=ga%253A57262238&start-date=7daysAgo&end-date=yesterday&metrics=ga%253Asessions&dimensions=ga%253Adate&output=JSON&_h=7>`_