import React from 'react';
import Reflux from 'reflux';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import classSet from 'react-classset';
import c3 from 'c3';
import _ from 'lodash';
import moment from 'moment';
import Mozaik from 'mozaik/browser';


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

reactMixin(PageView.prototype, ListenerMixin);
reactMixin(PageView.prototype, Mozaik.Mixin.ApiConsumer);

module.exports = TopPages;
