var React = require('react');
var Reflux = require('reflux');
var classSet = require('react-classset');
var c3 = require('c3');
var _ = require('lodash');
var moment = require('moment');
var ApiConsumerMixin = require('mozaik/browser').Mixin.ApiConsumer;


var TopPages = React.createClass({
  mixins: [
    Reflux.ListenerMixin,
    ApiConsumerMixin
  ],

  propTypes: {
    id: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      entries: []
    }
  },

  getApiRequest() {
    var id = 'analytics.topPages';

    return {
      id: id,
      params: {
        id: this.props.id,
        dimensions: this.props.dimensions,
        startDate: this.props.startDate,
        endDate: this.props.endDate
      }
    };
  },

  onApiData(data) {
    this.setState({
      entries: data.results
    });
  },

  render() {
    var title = this.props.title || 'Analytics';
    var avg = this.state.avg || '-';
    var total = this.state.total || '-';

    var entries = _.map(this.state.entries, function(entry) {
      var entryObj = _.zipObject(['pagePath', 'pageViews', 'avgTimeOnPage'], entry);
      return <li>
        <span className="path">{entryObj.pagePath.value}</span>
        <span className="delimeter">-</span>
        <span className="value">{entryObj.pageViews.value}</span>
      </li>;
    });

    var widget = (
      <div>
        <div className="widget__header">
          {title}
          <i className="fa fa-line-chart" />
        </div>
        <div className="widget__body analytics__top_pages">
          <ol>{entries}</ol>
        </div>
      </div>
    );

    return widget;
  }
});

module.exports = TopPages;
