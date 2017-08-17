import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveBar } from 'nivo'
import { Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { resultsMapper } from '../lib/dto'

const mapResults = resultsMapper({
    'ga:pagePath': ['page'],
    'ga:avgTimeOnPage': ['avg. time', v => Number(Number(v).toFixed(2))],
})

const margin = { top: 10, right: 20, bottom: 54, left: 140 }
const axisLeft = {
    format: v => {
        if (v.length <= 14) return v
        return `${v.slice(0, 14)}…`
    },
}
const axisBottom = {
    legend: 'avg. time',
    legendPosition: 'center',
    legendOffset: 36,
}

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
            body = (
                <ResponsiveBar
                    data={mapResults(apiData.results).reverse()}
                    indexBy="page"
                    keys={['avg. time']}
                    groupMode="grouped"
                    layout="horizontal"
                    margin={margin}
                    theme={theme.charts}
                    colors={theme.charts.colors}
                    enableLabels={false}
                    enableGridX={true}
                    enableGridY={false}
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
