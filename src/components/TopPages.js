import React, { Component, PropTypes } from 'react'
import {
    WidgetHeader,
    WidgetBody,
    WidgetTable as Table,
    WidgetTableCell as Cell,
    WidgetTableHeadCell as HeadCell,
} from 'mozaik/ui'


export default class TopPages extends Component {
    static propTypes = {
        id:      PropTypes.number.isRequired,
        apiData: PropTypes.shape({
            rows: PropTypes.array.isRequired,
        })
    }

    static getApiRequest({ id, dimensions, startDate, endDate }) {
        return {
            id:     `analytics.topPages.${id}.${startDate || ''}.${endDate || ''}`,
            params: { id, dimensions, startDate, endDate },
        }
    }

    render() {
        const { title, apiData } = this.props

        let items = null
        if (apiData) {
            const { rows } = apiData
            items = (
                <Table>
                    <thead>
                        <tr>
                            <HeadCell>page</HeadCell>
                            <HeadCell>views</HeadCell>
                            <HeadCell>avg. time</HeadCell>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row[0]}>
                                <Cell>{row[0]}</Cell>
                                <Cell>{row[1]}</Cell>
                                <Cell>{row[2]}</Cell>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )
        }

        return (
            <div>
                <WidgetHeader
                    title={title || 'Analytics'}
                    count={apiData ? apiData.totalsForAllResults['ga:pageviews'] : null}
                    icon="line-chart"
                />
                <WidgetBody>
                    {items}
                </WidgetBody>
            </div>
        )
    }
}
