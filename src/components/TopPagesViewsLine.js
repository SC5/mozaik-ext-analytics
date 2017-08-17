import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { ResponsiveLine } from 'nivo'
import { resultsMapper } from '../lib/dto'

const mapResults = resultsMapper({
    'ga:pagePath': ['x'],
    'ga:pageviews': ['y', v => Number(v)],
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

    static getApiRequest({ id, startDate, endDate }) {
        return {
            id: `analytics.topPages.${id}.${startDate || ''}.${endDate || ''}`,
            params: { id, startDate, endDate },
        }
    }

    render() {
        const { title, apiData, theme } = this.props

        let body = <WidgetLoader />
        if (apiData) {
            const data = [
                {
                    id: 'views',
                    data: mapResults(apiData.results),
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
