import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { ResponsiveLine } from 'nivo'
import { mapResults } from '../lib/dto'

const mapper = mapResults({
    'ga:pagePath': 'page',
    'ga:pageviews': 'views',
})

const margin = { top: 20, right: 20, bottom: 40, left: 60 }
const axisLeft = {
    legend: 'views',
    legendPosition: 'center',
    legendOffset: -40,
}
const axisBottom = {}

export default class TopPagesViewsLine extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        apiData: PropTypes.shape({
            rows: PropTypes.array.isRequired,
        }),
        theme: PropTypes.object.isRequired,
    }

    static defaultProps = {
        title: 'Top pages views',
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
                    id: 'views',
                    data: mapper(apiData.results).map(({ page, views }) => ({
                        x: page,
                        y: Number(views),
                    })),
                },
            ]

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
                <WidgetHeader
                    title={title}
                    count={apiData ? apiData.totalsForAllResults['ga:pageviews'] : null}
                    icon="line-chart"
                />
                <WidgetBody style={{ overflowY: 'hidden' }}>
                    {body}
                </WidgetBody>
            </Widget>
        )
    }
}
