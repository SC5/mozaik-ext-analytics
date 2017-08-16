import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveBar } from 'nivo'
import { Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { mapResults } from '../lib/dto'

const mapper = mapResults({
    'ga:pagePath': 'page',
    'ga:avgTimeOnPage': 'avgTime',
})

const margin = { top: 20, right: 20, bottom: 40, left: 60 }
const axisLeft = {
    legend: 'avg. time',
    legendPosition: 'center',
    legendOffset: -40,
}
const axisBottom = {}

export default class TopPagesAvgTimeBar extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        apiData: PropTypes.shape({
            rows: PropTypes.array.isRequired,
        }),
        theme: PropTypes.object.isRequired,
    }

    static defaultProps = {
        title: 'Top pages avg. time',
    }

    static getApiRequest({ id, dimensions, startDate, endDate }) {
        return {
            id: `analytics.topPages.${id}.${startDate || ''}.${endDate || ''}`,
            params: { id, dimensions, startDate, endDate },
        }
    }

    render() {
        const { title, apiData, theme } = this.props

        let body = <WidgetLoader />
        if (apiData) {
            const data = [
                {
                    id: 'avg. time',
                    data: mapper(apiData.results).map(({ page, avgTime }) => ({
                        x: page,
                        y: Number(avgTime).toFixed(2),
                    })),
                },
            ]

            body = (
                <ResponsiveBar
                    data={data}
                    margin={margin}
                    theme={theme.charts}
                    colors={theme.charts.colors}
                    enableLabels={false}
                    animate={false}
                    xPadding={0.3}
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
