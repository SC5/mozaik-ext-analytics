import React, { Component, PropTypes } from 'react'
import { WidgetHeader, WidgetBody }    from 'mozaik/ui'
import {
    ResponsiveChart as Chart,
    Scale,
    Axis,
    Grid,
    Bars,
} from 'nivo'


const margin = { top: 30, right: 20, bottom: 20, left: 200 }


class TopPagesViewsBars extends Component {
    static getApiRequest({ id, dimensions, startDate, endDate }) {
        return {
            id:     `analytics.topPages.${id}.${startDate || ''}.${endDate || ''}`,
            params: { id, dimensions, startDate, endDate },
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
                            if (k === 'pageviews') return Number(v)
                            if (k !== 'date') return v
                            return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`
                        })
                        .value()
                })
                .reverse()

            // enableLabels={false}
            // colors="set3"
            body = (
                <Chart data={data} animate={true} margin={margin} theme={theme.charts}>
                    <Scale id="page" dataKey="pagePath" type="band" padding={0.4} axis="y"/>
                    <Scale id="views" dataKey="pageviews" type="linear" axis="x"/>
                    <Grid xScale="views"/>
                    <Axis axis="x" scaleId="views" position="top"/>
                    <Axis axis="y" scaleId="page" position="left" tickSize={0} tickPadding={15}/>
                    <Bars xScale="views" yScale="page" x="pageviews" y="pagePath" color="#fff" />
                </Chart>
            )
        }

        return (
            <div>
                <WidgetHeader
                    title={title}
                    count={apiData ? apiData.totalsForAllResults['ga:pageviews'] : null}
                    icon="line-chart"
                />
                <WidgetBody style={{ overflowY: 'hidden' }}>
                    {body}
                </WidgetBody>
            </div>
        )
    }
}

TopPagesViewsBars.propTypes = {
    title:   PropTypes.string.isRequired,
    id:      PropTypes.number.isRequired,
    apiData: PropTypes.shape({
        rows: PropTypes.array.isRequired,
    })
}

TopPagesViewsBars.defaultProps = {
    title: 'Top pages views',
}


export default TopPagesViewsBars
