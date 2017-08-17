import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Widget,
    WidgetHeader,
    WidgetBody,
    WidgetLoader,
    WidgetTable as Table,
    WidgetTableCell as Cell,
    WidgetTableHeadCell as HeadCell,
} from '@mozaik/ui'

export default class TopPages extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        apiData: PropTypes.shape({
            rows: PropTypes.array.isRequired,
        }),
        title: PropTypes.string,
    }

    static getApiRequest({ id, startDate, endDate }) {
        return {
            id: `analytics.topPages.${id}.${startDate || ''}.${endDate || ''}`,
            params: { id, startDate, endDate },
        }
    }

    render() {
        const { title, apiData } = this.props

        let items = <WidgetLoader />
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
                        {rows.map(row =>
                            <tr key={row[0]}>
                                <Cell>
                                    {row[0]}
                                </Cell>
                                <Cell>
                                    {row[1]}
                                </Cell>
                                <Cell>
                                    {Number(row[2]).toFixed(2)}
                                </Cell>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )
        }

        return (
            <Widget>
                <WidgetHeader
                    title={title || 'Top pages views/avg. time'}
                    count={apiData ? apiData.totalsForAllResults['ga:pageviews'] : null}
                    icon="line-chart"
                />
                <WidgetBody>
                    {items}
                </WidgetBody>
            </Widget>
        )
    }
}
