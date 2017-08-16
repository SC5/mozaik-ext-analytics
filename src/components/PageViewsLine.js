import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import { Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { ResponsiveLine } from 'nivo'

const margin = { top: 20, right: 20, bottom: 40, left: 60 }
const format = d => moment(d).format('MM/DD')
const axisLeft = {
    legend: 'sessions/views',
    legendPosition: 'center',
    legendOffset: -40,
}
const axisBottom = {
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
            const data = apiData.results.reduce(
                (acc, entry) => {
                    const date = _.find(entry, d => d.col.name === 'ga:date')
                    const views = _.find(entry, d => d.col.name === 'ga:pageviews')
                    const sessions = _.find(entry, d => d.col.name === 'ga:sessions')

                    if (date && views && sessions) {
                        const dateString = `${date.value.slice(0, 4)}-${date.value.slice(
                            4,
                            6
                        )}-${date.value.slice(6, 8)}`

                        acc[0].data.push({
                            x: dateString,
                            y: Number(views.value),
                        })
                        acc[1].data.push({
                            x: dateString,
                            y: Number(sessions.value),
                        })
                    }

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
