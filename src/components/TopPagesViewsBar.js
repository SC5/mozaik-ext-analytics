import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { ResponsiveBar } from 'nivo'
import { resultsMapper } from '../lib/dto'

const mapResults = resultsMapper({
    'ga:pagePath': ['page'],
    'ga:pageviews': ['views', v => Number(v)],
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

export default class TopPagesViewsBar extends Component {
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
            body = (
                <ResponsiveBar
                    data={mapResults(apiData.results).reverse()}
                    indexBy="page"
                    keys={['views']}
                    groupMode="grouped"
                    layout="horizontal"
                    margin={margin}
                    theme={theme.charts}
                    colors={theme.charts.colors}
                    labelsTextColor="inherit:darker(1.2)"
                    labelsLinkColor="inherit"
                    animate={false}
                    enableLabels={false}
                    xPadding={0.3}
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
