import React, { Component, PropTypes } from 'react'
import { ResponsiveBar }               from 'nivo'
import {
    Widget,
    WidgetHeader,
    WidgetBody,
    WidgetLoader,
} from 'mozaik/ui'


export default class TopPagesAvgTimeBars extends Component {
    static propTypes = {
        title:   PropTypes.string.isRequired,
        id:      PropTypes.number.isRequired,
        apiData: PropTypes.shape({
            rows: PropTypes.array.isRequired,
        })
    }

    static defaultProps = {
        title: 'Top pages avg. time',
    }

    static getApiRequest({ id, dimensions, startDate, endDate }) {
        return {
            id:     `analytics.topPages.${id}.${startDate || ''}.${endDate || ''}`,
            params: { id, dimensions, startDate, endDate },
        }
    }

    render() {
        const { title, apiData } = this.props

        let body = <WidgetLoader />
        if (apiData) {
            const data = apiData.results
                .map(entry => {
                    return _(entry)
                        .keyBy(o => o.col.name.slice(3))
                        .mapValues((o, k) => {
                            const v = o.value
                            if (k === 'avgTimeOnPage') return Number(v)
                            if (k !== 'date') return v
                            return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`
                        })
                        .value()
                })
                .reverse()

            body = (
                <ResponsiveBar
                    data={data}
                    groupMode="grouped"
                    animate={true}
                    enableLabels={false}
                    colors="set3"
                    margin={{
                        top:    30,
                        right:  20,
                        bottom: 20,
                        left:   200,
                    }}
                    scales={[
                        {
                            id:      'page',
                            key:     'pagePath',
                            type:    'band',
                            padding: 0.4,
                            axis:    'y',
                        },
                        {
                            id:   'avgTime',
                            key:  'avgTimeOnPage',
                            type: 'linear',
                            axis: 'x',
                        },
                    ]}
                    series={[
                        {
                            xScale: 'avgTime',
                            yScale: 'page',
                            x:      'avgTimeOnPage',
                            y:      'pagePath',
                        },
                    ]}
                    axes={{
                        left: {
                            scale:       'page',
                            tickSize:    0,
                            tickPadding: 15,
                        },
                        top:  { scale: 'avgTime' },
                    }}
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
