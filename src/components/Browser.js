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

export default class Browser extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        apiData: PropTypes.shape({
            totals: PropTypes.object.isRequired,
            results: PropTypes.array.isRequired,
        }),
    }

    static defaultProps = {
        title: 'Browser',
    }

    static getApiRequest({ id, dimensions, startDate, endDate }) {
        return {
            id: `analytics.browser.${id}.${startDate || ''}.${endDate || ''}`,
            params: { id, dimensions, startDate, endDate },
        }
    }

    render() {
        const { title, apiData } = this.props

        let items = <WidgetLoader />
        if (apiData) {
            const { results } = apiData
            items = (
                <Table>
                    <thead>
                        <tr>
                            <HeadCell>browser</HeadCell>
                            <HeadCell>version</HeadCell>
                            <HeadCell>sessions</HeadCell>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(row =>
                            <tr key={`${row.browser}.${row.browserVersion}`}>
                                <Cell>
                                    {row.browser}
                                </Cell>
                                <Cell>
                                    {row.browserVersion}
                                </Cell>
                                <Cell>
                                    {row.sessions}
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
                    title={title}
                    count={apiData ? apiData.totals.sessions : null}
                    icon="line-chart"
                />
                <WidgetBody>
                    {items}
                </WidgetBody>
            </Widget>
        )
    }
}
