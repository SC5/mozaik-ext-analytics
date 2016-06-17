import format from 'string-format';
import React from 'react';
import Reflux from 'reflux';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import classSet from 'react-classset';
import c3 from 'c3';
import _ from 'lodash';
import moment from 'moment';
import Mozaik from 'mozaik/browser';

class TimeseriesChart {

  constructor(bindTo, opts) {
    opts = opts || {};
    this.chart = c3.generate({
      bindto: bindTo,
      transition: {
        // Skipping transition for now
        duration: null
      },
      data: {
        labels: true,
        x: 'x',
        xFormat: '%Y-%m-%d',
        columns: []
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: (x) => {
              return moment(x).format('ddd D');
            },
            count: opts.tickCount
          }
        },
        y: {
          min: 0
        }
      }
    });
  }

  load(data) {
    return this.chart.load(data);
  }

  loadEntries(entries) {
    var xData = [];
    var visitsData = [];
    var sessionsData = [];
    var weekDayRegions = [];

    if (!entries || entries.length === 0) {
      console.warn('No statistics provided');
      return;
    }

    entries.forEach((entry) => {
      //
      var entryObj = _.zipObject(['date', 'views', 'sessions'], entry);
      var date = moment(entryObj.date.value, 'YYYYMMDD');

      // Mark Sat and Sun with region
      if (_.contains([6, 7], date.isoWeekday())) {
        var weekDayRegion = {
          start: date.format('YYYY-MM-DD'),
          end: date.format('YYYY-MM-DD')
        };
        weekDayRegions.push(weekDayRegion);
      };

      xData.push(date.format('YYYY-MM-DD'));
      visitsData.push(parseInt(entryObj.views.value, 10));
      sessionsData.push(parseInt(entryObj.sessions.value, 10));
    });

    return this.load({
      columns: [
        ['x'].concat(xData),
        ['Page views'].concat(visitsData),
        ['Sessions'].concat(sessionsData)
      ],
      regions: weekDayRegions
    });
  }
};


class PageViews {

  constructor() {
    this.chartClassName = 'chart';
    this.chart = null;
  }

  getInitialState() {
    return {
      total: null,
      avg: null,
      entries: []
    }
  }

  componentDidMount() {
    var chartElement = this.getDOMNode().getElementsByClassName(this.chartClassName)[0];
    this.chart = new TimeseriesChart(chartElement, {
      min: this.props.min,
      max: this.props.max,
      tickCount: this.props.tickCount,
      dateFormat: this.props.dateFormat
    });
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getApiRequest() {
    var id = `analytics.pageViews.${this.props.id}`;

    return {
      id: id,
      params: {
        id: this.props.id,
        startDate: this.props.startDate,
        endDate: this.props.endDate
      }
    };
  }

  onApiData(data) {
    var total = data.totalsForAllResults['ga:pageviews'] || null;
    var avg = Math.floor(total / data.totalResults, -1);

    this.setState({
      total: total,
      avg: avg,
      entries: data.results
    });

    this.chart.loadEntries(this.state.entries);
  }

  render() {
    var title = this.props.title || 'Analytics';
    var avg = this.state.avg || '-';
    var total = this.state.total || '-';

    var widget = (
      <div>
        <div className="widget__header">
          {title}
          <span className="widget__header__count">
            <span className="label">avg</span>
            <span className="value">{avg}</span>
            <span className="delimeter">/</span>
            <span className="label">total</span>
            <span className="value">{total}</span>
          </span>
          <i className="fa fa-line-chart" />
        </div>
        <div className="widget__body">
          <div className={this.chartClassName}></div>
        </div>
      </div>
    );

    return widget;
  }

}

PageViews.displayName = 'PageViews';

PageViews.propTypes = {
  id: React.PropTypes.string.isRequired
};

reactMixin(PageViews.prototype, ListenerMixin);
reactMixin(PageViews.prototype, Mozaik.Mixin.ApiConsumer);

export default PageViews;
