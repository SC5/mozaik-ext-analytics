# mozaik-ext-analytics

Module provides some Google Analytics widgets for Mozaïk dashboard.

![preview-page-views](https://raw.githubusercontent.com/SC5/mozaik-ext-analytics/master/previews/page_views.png)

**Table of contents**
<!-- MarkdownTOC depth=0 autolink=true bracket=round -->

- [Setup](#setup)
  - [Dependencies](#dependencies)
  - [Google Analytics](#google-analytics)
- [Widgets](#widgets)
  - [`<Browser />`](#browser)
  - [`<PageViews />`](#pageviews)
  - [`<PageViewsLines />`](#pageviewslines)
  - [`<TopPages />`](#toppages)
  - [`<TopPagesAvgTimeBars />`](#toppagesavgtimebars)
  - [`<TopPagesViewsBars />`](#toppagesviewsbars)
  - [`<TopPagesViewsLines />`](#toppagesavgtimelines)
- [License](#license)
- [Credit](#credit)

<!-- /MarkdownTOC -->


## Setup

Follow the steps to install and configure widget into dashboard

### Dependencies

- Install modules from npmjs:

  ```shell
  npm install -S mozaik-ext-analytics
  ```

- Register client api by adding to dashboard `app.js`:

  ```javascript
  import analytics from 'mozaik-ext-analytics/client';
  mozaik.bus.registerApi('analytics', analytics;
  ```

- Register widgets by adding to dashboard `src/App.jsx`:

  ```javascript
  import analytics from 'mozaik-ext-analytics';
  mozaik.addBatch('analytics', analytics);
  ```

- (Re)build the dashboard:

  ``` sh
  # npm
  npm run build
  # yarn
  yarn run build
  ```

- Configure widgets (see Widgets -section)
- Start dashboard: `node app.js`

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
  # one of the following:
  GOOGLE_SERVICE_KEY=abcdef123456...
  GOOGLE_SERVICE_KEYPATH=mozaik-ext-analytics.pem
  ```

  Alternatively use `export` command to set environment variables.

- Run command line app to retrieve ids (or see them from analytics - see references):

  ``` sh
  ./node_modules/mozaik-ext-analytics/bin/mozaik-analytics --keypath PATH_TO_JSON_KEY_FILE profiles
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
      // NOTE: Either key or key path needs to be provided
      googleServiceEmail: process.env.GOOGLE_SERVICE_EMAIL,
      googleServiceKey: process.env.GOOGLE_SERVICE_KEY
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





### Browser

> Display browser stats (table).

#### parameters

key           | required | description
--------------|----------|---------------
`id`          | yes      | *Id of the analytics data to show. See setup steps or analytics view for more info. Example: `1231234321`*
`startDate`   | no       | *Starting date info used in Analytics. Example/default: '30daysAgo'*
`endDate`     | no       | *End date info used in Analytics. Example/default: 'yesterday'*
`title`       | no       | *Textual title to show. Example: 'My website'.*

#### usage

``` yaml
# config.yml
dashboards:
- # …
  widgets:
  - extension:    analytics
    widget:       Browser
    id:           xxxxxxxx
    columns:      1
    rows:         1
    x:            0
    y:            0
```


### PageViews

> Display browser stats (table).

#### parameters

key           | required | description
--------------|----------|---------------
`id`          | yes      | *Id of the analytics data to show. See setup steps or analytics view for more info. Example: `1231234321`*
`startDate`   | no       | *Starting date info used in Analytics. Example/default: '30daysAgo'*
`endDate`     | no       | *End date info used in Analytics. Example/default: 'yesterday'*
`title`       | no       | *Textual title to show. Example: 'My website'.*

#### Usage

``` yaml
# config.yml
dashboards:
- # …
  widgets:
  - extension:    analytics
    widget:       PageViews
    id:           xxxxxxxx
    columns:      1
    rows:         1
    x:            0
    y:            0
```


### PageViewsLines

> Display browser stats (table).

#### parameters

key           | required | description
--------------|----------|---------------
`id`          | yes      | *Id of the analytics data to show. See setup steps or analytics view for more info. Example: `1231234321`*
`startDate`   | no       | *Starting date info used in Analytics. Example/default: '30daysAgo'*
`endDate`     | no       | *End date info used in Analytics. Example/default: 'yesterday'*
`title`       | no       | *Textual title to show. Example: 'My website'.*

#### Usage

``` yaml
# config.yml
dashboards:
- # …
  widgets:
  - extension:    analytics
    widget:       PageViewsLines
    id:           xxxxxxxx
    columns:      1
    rows:         1
    x:            0
    y:            0
```


### TopPages

> Display browser stats (table).

#### parameters

key           | required | description
--------------|----------|---------------
`id`          | yes      | *Id of the analytics data to show. See setup steps or analytics view for more info. Example: `1231234321`*
`startDate`   | no       | *Starting date info used in Analytics. Example/default: '30daysAgo'*
`endDate`     | no       | *End date info used in Analytics. Example/default: 'yesterday'*
`title`       | no       | *Textual title to show. Example: 'My website'.*

#### Usage

``` yaml
# config.yml
dashboards:
- # …
  widgets:
  - extension:    analytics
    widget:       TopPages
    id:           xxxxxxxx
    columns:      1
    rows:         1
    x:            0
    y:            0
```


### TopPagesAvgTimeBars

> Display browser stats (table).

#### parameters

key           | required | description
--------------|----------|---------------
`id`          | yes      | *Id of the analytics data to show. See setup steps or analytics view for more info. Example: `1231234321`*
`startDate`   | no       | *Starting date info used in Analytics. Example/default: '30daysAgo'*
`endDate`     | no       | *End date info used in Analytics. Example/default: 'yesterday'*
`title`       | no       | *Textual title to show. Example: 'My website'.*

#### Usage

``` yaml
# config.yml
dashboards:
- # …
  widgets:
  - extension:    analytics
    widget:       TopPagesAvgTimeBars
    id:           xxxxxxxx
    columns:      1
    rows:         1
    x:            0
    y:            0
```


### TopPagesViewsBars

> Display browser stats (table).

#### parameters

key           | required | description
--------------|----------|---------------
`id`          | yes      | *Id of the analytics data to show. See setup steps or analytics view for more info. Example: `1231234321`*
`startDate`   | no       | *Starting date info used in Analytics. Example/default: '30daysAgo'*
`endDate`     | no       | *End date info used in Analytics. Example/default: 'yesterday'*
`title`       | no       | *Textual title to show. Example: 'My website'.*

#### Usage

``` yaml
# config.yml
dashboards:
- # …
  widgets:
  - extension:    analytics
    widget:       TopPagesViewsBars
    id:           xxxxxxxx
    columns:      1
    rows:         1
    x:            0
    y:            0
```


### TopPagesViewsLines

> Display browser stats (table).

#### parameters

key           | required | description
--------------|----------|---------------
`id`          | yes      | *Id of the analytics data to show. See setup steps or analytics view for more info. Example: `1231234321`*
`startDate`   | no       | *Starting date info used in Analytics. Example/default: '30daysAgo'*
`endDate`     | no       | *End date info used in Analytics. Example/default: 'yesterday'*
`title`       | no       | *Textual title to show. Example: 'My website'.*

#### Usage

``` yaml
# config.yml
dashboards:
- # …
  widgets:
  - extension:    analytics
    widget:       TopPagesViewsLines
    id:           xxxxxxxx
    columns:      1
    rows:         1
    x:            0
    y:            0
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
`dimensions`  | no       | *The dimensions and metrics explorer lists and describes all the dimensions and metrics available through the Core Reporting API. Use this reference [API](https://developers.google.com/analytics/devguides/reporting/core/dimsmets) : Example: `ga:pageTitle`*
`startDate`   | no       | *Starting date info used in Analytics. Example/default: '30daysAgo'*
`endDate`     | no       | *End date info used in Analytics. Example/default: 'yesterday'*
`title`       | no       | *Textual title to show. Example: 'My website'.*

### usage

``` yaml
# config.yml
dashboards:
- # …
  widgets:
  - type:       analytics.top_pages
    id:         123123123
    startDate:  30daysAgo
    columns:    2
    rows:       1
    x:          0
    y:          0
```

## License

Distributed under the MIT license

## Credit

The module is backed by [SC5](http://sc5.io/)
