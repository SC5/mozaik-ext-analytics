import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { ResponsiveBar } from 'nivo'

const margin = { top: 20, right: 20, bottom: 40, left: 60 }
const axisLeft = {
    legend: 'views',
    legendPosition: 'center',
    legendOffset: -40,
}
const axisBottom = {}

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
                    data: apiData.results.reduce((acc, entry) => {
                        const page = _.find(entry, d => d.col.name === 'ga:pagePath')
                        const pageViews = _.find(entry, d => d.col.name === 'ga:pageviews')

                        if (page && pageViews) {
                            return [
                                ...acc,
                                {
                                    x: page.value,
                                    y: Number(pageViews.value),
                                },
                            ]
                        }

                        return acc
                    }, []),
                },
            ]

            body = (
                <ResponsiveBar
                    data={data}
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
