import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { ResponsiveLine } from 'nivo'
import { resultsMapper } from '../lib/dto'

const mapResults = resultsMapper({
    'ga:date': ['date'],
    'ga:pageviews': ['views', v => Number(v)],
    'ga:sessions': ['sessions', v => Number(v)],
})

const margin = { top: 20, right: 20, bottom: 54, left: 60 }
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

export default class PageViewsLine extends Component {
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
        startDate: '14daysAgo',
    }

    static getApiRequest({ id, startDate = PageViewsLine.defaultProps.startDate, endDate }) {
        return {
            id: `analytics.pageViews.${id}.${startDate || ''}.${endDate || ''}`,
            params: { id, startDate, endDate },
        }
    }

    render() {
        const { title, apiData, theme } = this.props

        let body = <WidgetLoader />
        if (apiData) {
            const data = mapResults(apiData.results).reduce(
                (acc, { date, views, sessions }) => {
                    acc[0].data.push({
                        x: date,
                        y: views,
                    })
                    acc[1].data.push({
                        x: date,
                        y: sessions,
                    })

                    return acc
                },
                [
                    {
                        id: 'views',
                        data: [],
                    },
                    {
                        id: 'sessions',
                        data: [],
                    },
                ]
            )

            body = (
                <ResponsiveLine
                    data={data}
                    margin={margin}
                    theme={theme.charts}
                    colors={theme.charts.colors}
                    animate={false}
                    axisLeft={axisLeft}
                    axisBottom={axisBottom}
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
