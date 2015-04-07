# mozaik-ext-analytics

Module provides some Google Analytics widgets for Mozaïk dashboard.

![preview-page-views](https://raw.githubusercontent.com/SC5/mozaik-ext-analytics/master/previews/page_views.png)

**Table of contents**
<!-- MarkdownTOC depth=0 autolink=true bracket=round -->

- [Setup](#setup)
  - [Dependencies](#dependencies)
  - [Google Analytics](#google-analytics)
  - [Widgets](#widgets)
- [Widget: analytics.page_views](#widget-analyticspage_views)
  - [parameters](#parameters)
  - [usage](#usage)
- [Widget: analytics.top_pages](#widget-analyticstop_pages)
  - [parameters](#parameters-1)
  - [usage](#usage-1)
- [License](#license)
- [Credit](#credit)

<!-- /MarkdownTOC -->


## Setup

Follow the steps to install and configure widget into dashboard

### Dependencies

- Install modules from npmjs:

  ```shell
  npm install mozaik-ext-analytics
  ```

- Register client api by adding to dashboard `app.js`:

  ```javascript
  mozaik.bus.registerApi('analytics', require('mozaik-ext-analytics/client'));
  ```

- Register widgets by adding to dashboard ``src/App.jsx``:

  ```javascript
  mozaik.addBatch('analytics', require('mozaik-ext-analytics'));
  ```

- Build the dashboard:

  ```shell
  gulp publish
  ```

### Google Analytics

- Login to Developers Console: https://console.developers.google.com/
  (register Google account if you don't already have one)

- Create new project `dashboard` (or similar)

- Enable following `Analytics API` from permissions

- Create *Service account* under Credentials:
  Create new Client ID -> Service account -> Download mozaik-ext-analytics.p12 file

- Convert .p12 file into .pem format with command:

  ```shell
  openssl pkcs12 -in mozaik-ext-analytics*.p12 -nodes -nocerts > mozaik-ext-analytics.pem
  ```

  The password for .p12 file is `notasecret`

- Authorize service user to acces analytics *property* in question by adding the service
  email address via User Management

- Configure service auth details in dashboard root file: `.env` (or as environment variables):

  ```shell
  GOOGLE_SERVICE_EMAIL=generated-by-google-console@developer.gserviceaccount.com
  GOOGLE_SERVICE_KEYPATH=mozaik-ext-analytics.pem
  ```

  Alternatively use `export` command to set environment variables.

- Run command line app to retrieve ids (or see them from analytics - see references):

  ```shell
  node node_modules/mozaik-ext-analytics/cli.js
  ```

  **OR**

  - [Navigate to Analytics api explorer](https://developers.google.com/apis-explorer/#p/analytics/v3/analytics.management.accountSummaries.list?_h=2&)
  - Authorize request from OAuth 2.0 button in top-right corner
  - Select the wanted id from wanted `profiles[n].id` field

### Widgets

Set api and wiget configuration values in dashboard `config.js`.
See followup section for details.

```javascript
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
```

Finally, start the dashboard with command:

```shell
node app.js
```

## Widget: analytics.page_views

Show the number of page views as a timeseries

![preview-page-views](https://raw.githubusercontent.com/SC5/mozaik-ext-analytics/master/previews/page_views.png)

### parameters

key           | required | description
--------------|----------|---------------
`id`          | yes      | *Id of the analytics data to show. See setup steps or analytics view for more info. Example: `1231234321`*
`startDate`   | no       | *Starting date info used in Analytics. Example/default: '30daysAgo'*
`endDate`     | no       | *End date info used in Analytics. Example/default: 'yesterday'*
`title`       | no       | *Textual title to show. Example: 'My website'.*


### usage

```javascript
{
  type: 'analytics.page_views',
  id: '123123123',
  startDate: '30daysAgo',
  columns: 2, rows: 1,
  x: 1, y: 0
}
```

## Widget: analytics.top_pages

Show list of pages, in order of most visits within given time range.

![preview-top-pages](https://raw.githubusercontent.com/SC5/mozaik-ext-analytics/master/previews/top_pages.png)

### parameters

key           | required | description
--------------|----------|---------------
`id`          | yes      | *Id of the analytics data to show. See setup steps or analytics view for more info. Example: `1231234321`*
`startDate`   | no       | *Starting date info used in Analytics. Example/default: '30daysAgo'*
`endDate`     | no       | *End date info used in Analytics. Example/default: 'yesterday'*
`title`       | no       | *Textual title to show. Example: 'My website'.*

### usage

```javascript
{
  type: 'analytics.top_pages',
  id: '123123123',
  startDate: '30daysAgo',
  columns: 2, rows: 1,
  x: 1, y: 0
}
```

## License

Distributed under the MIT license

## Credit

The module is backed by [SC5](http://sc5.io/)
