import React, { Component, PropTypes } from 'react'
import { WidgetHeader, WidgetBody }    from 'mozaik/ui'


class TopPages extends Component {
    static getApiRequest({ id, dimensions, startDate, endDate }) {
        return {
            id:     `analytics.topPages.${id}`,
            params: { id, dimensions, startDate, endDate },
        }
    }

    render() {
        const { title, apiData } = this.props

        let items = null
        if (apiData) {
            const { rows } = apiData
            items = (
                <table>
                    <thead>
                        <tr>
                            <th>page</th>
                            <th>views</th>
                            <th>avg. time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr>
                                <td className="path">{row[0]}</td>
                                <td className="value">{row[1]}</td>
                                <td className="delimeter">{row[2]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

TopPages.propTypes = {
    id:      PropTypes.number.isRequired,
    apiData: PropTypes.shape({
        rows: PropTypes.array.isRequired,
    })
}


export default TopPages
