import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { ResponsiveTreeMap } from 'nivo'
import { resultsMapper } from '../lib/dto'

const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
}

const mapResults = resultsMapper({
    'ga:pagePath': ['page'],
    'ga:pageviews': ['views', v => Number(v)],
    'ga:avgTimeOnPage': ['avgTime', v => Number(Number(v).toFixed(2))],
})

export default class TopPagesViewsTreemap extends Component {
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
            const data = {
                id: 'views',
                children: mapResults(apiData.results),
            }

            body = (
                <ResponsiveTreeMap
                    margin={margin}
                    identity="page"
                    value="views"
                    root={data}
                    colors={theme.charts.colors}
                    colorBy="page"
                    leavesOnly={true}
                    innerPadding={2}
                    enableLabels={true}
                    animate={false}
                    label="page"
                    labelTextColor="inherit:darker(1.2)"
                />
            )
        }

        return (
            <Widget>
                <WidgetHeader
                    title={title}
                    count={apiData ? apiData.totalsForAllResults['ga:pageviews'] : null}
                />
                <WidgetBody style={{ overflowY: 'hidden' }}>
                    {body}
                </WidgetBody>
            </Widget>
        )
    }
}
