import React, { Component, PropTypes } from 'react'
import _                               from 'lodash'
import moment                          from 'moment'
import { WidgetHeader, WidgetBody }    from 'mozaik/ui'
import {
    ResponsiveChart as Chart,
    Scale,
    Axis,
    Grid,
    Line,
    Bars,
} from 'nivo'


const margin     = { top: 20, right: 20, bottom: 40, left: 60 }
const aggregate  = d => Math.max(d.pageviews, d.sessions)
const formatDate = d => moment(d).format('MM/DD')


class PageViewsLines extends Component {
    static getApiRequest({
        id,
        startDate = PageViewsLines.defaultProps.startDate,
        endDate
    }) {
        return {
            id:     `analytics.pageViews.${id}.${startDate || ''}.${endDate || ''}`,
            params: { id, startDate, endDate },
        }
    }

    static contextTypes = {
        theme: PropTypes.object.isRequired,
    }

    render() {
        const { title, apiData } = this.props
        const { theme }          = this.context

        let body = null
        if (apiData) {
            const data = apiData.results
                .map(entry => {
                    return _(entry)
                        .keyBy(o => o.col.name.slice(3))
                        .mapValues((o, k) => {
                            const v = o.value
                            if (['pageviews', 'sessions'].includes(k)) return Number(v)
                            if (k !== 'date') return v
                            return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`
                        })
                        .value()
                })

            //colors="set3"
            body = (
                <Chart data={data} animate={true} margin={margin} theme={theme.charts}>
                    <Scale id="agg"  dataKey={aggregate} type="linear" axis="y"/>
                    <Scale id="date" dataKey="date"      type="point"  axis="x"/>
                    <Grid xScale="date" yScale="agg" />
                    <Axis axis="x" position="bottom" scaleId="date" format={formatDate} />
                    <Axis axis="y" position="left"   scaleId="agg" />
                    <Line xScale="date" yScale="agg" x="date" y="pageviews" curve="monotoneX"/>
                    <Line xScale="date" yScale="agg" x="date" y="sessions" curve="monotoneX"/>
                </Chart>
            )
        }

        return (
            <div>
                <WidgetHeader
                    title={title}
                    icon="line-chart"
                />
                <WidgetBody style={{ overflowY: 'hidden' }}>
                    {body}
                </WidgetBody>
            </div>
        )
    }
}

PageViewsLines.propTypes = {
    id:         PropTypes.number.isRequired,
    title:      PropTypes.string,
    dateFormat: PropTypes.string,
    startDate:  PropTypes.string,
    endDate:    PropTypes.string,
    min:        PropTypes.number,
    max:        PropTypes.number,
    tickCount:  PropTypes.number,
};

PageViewsLines.defaultProps = {
    title:      'sessions/page views',
    dateFormat: 'YYYY-MM-DD',
    startDate:  '14daysAgo',
}


export default PageViewsLines
