import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { ResponsiveBar } from 'nivo'
import { resultsMapper } from '../lib/dto'

const mapResults = resultsMapper({
    'ga:date': ['date'],
    'ga:pageviews': ['views', v => Number(v)],
    'ga:sessions': ['sessions', v => Number(v)],
})

const margin = { top: 20, right: 30, bottom: 54, left: 60 }
const format = d => moment(d, 'YYYYMMDD').format('MM/DD')
const axisLeft = {
    legend: 'sessions/views',
    legendPosition: 'center',
    legendOffset: -40,
}
const axisBottom = {
    tickRotation: -60,
    format,
}

export default class PageViews extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
        dateFormat: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        tickCount: PropTypes.number,
        theme: PropTypes.object.isRequired,
        apiData: PropTypes.shape({
            results: PropTypes.array.isRequired,
        }),
    }

    static defaultProps = {
        title: 'sessions/page views',
        dateFormat: 'YYYY-MM-DD',
        startDate: '30daysAgo',
    }

    static getApiRequest({ id, startDate = PageViews.defaultProps.startDate, endDate }) {
        return {
            id: `analytics.pageViews.${id}.${startDate || ''}.${endDate || ''}`,
            params: { id, startDate, endDate },
        }
    }

    render() {
        const { title, apiData, theme } = this.props

        let body = <WidgetLoader />
        if (apiData) {
            body = (
                <ResponsiveBar
                    data={mapResults(apiData.results)}
                    indexBy="date"
                    keys={['sessions', 'views']}
                    margin={margin}
                    groupMode="grouped"
                    xPadding={0.3}
                    theme={theme.charts}
                    colors={theme.charts.colors}
                    enableLabels={false}
                    axisLeft={axisLeft}
                    axisBottom={axisBottom}
                    animate={false}
                />
            )
        }

        return (
            <Widget>
                <WidgetHeader title={title} icon="line-chart" />
                <WidgetBody style={{ overflowY: 'hidden' }}>
                    {body}
                </WidgetBody>
            </Widget>
        )
    }
}
