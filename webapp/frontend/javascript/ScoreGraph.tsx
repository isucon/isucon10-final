import React, { useState } from "react"
import { ResponsiveLine } from "@nivo/line"
import { BasicTooltip } from "@nivo/tooltip"
import useInterval from "use-interval"

import type { PointTooltipProps, Serie } from "@nivo/line"
import { ApiClient } from "./ApiClient"

const getRandomSeries = () => (
    [...new Array(5)].map(() => {
        let x = 0
        return {
            id: Math.random().toString(32).substring(2),
            data: [...new Array(10)].map(() => {
                x += ~~(Math.random() * 100)
                return { x, y: ~~(Math.random() * 2000) }
            })
        }
    })
)

const ToolTip = React.memo<PointTooltipProps>(
    ({ point }) => (
        <BasicTooltip
            id={
                <div>
                    <p><strong>Team:</strong> {point.serieId}</p>
                    <p><strong>Score:</strong> {point.data.yFormatted}</p>
                </div>
            }
            enableChip={false}
            color={point.serieColor}
        />
    )
)

interface Props {
    client: ApiClient
}

export const ScoreGraph: React.FC<Props> = ({ client }) => {
    const [series, setSeries] = useState<Serie[]>([])

    useInterval(async () => {
        setSeries(getRandomSeries())
    }, 1000, true)

    return (
        <div className="is-fullwidth" style={{ height: 480 }}>
            <ResponsiveLine
                data={series}
                margin={{ top: 10, right: 100, bottom: 55, left: 55 }}
                xScale={{ type: 'linear' }}
                yScale={{ type: 'linear' }}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickRotation: 0,
                    legend: 'Time',
                    legendOffset: 50,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickRotation: 0,
                    legend: 'Score',
                    legendOffset: -50,
                    legendPosition: 'middle'
                }}
                enableGridX={true}
                enableGridY={true}
                colors={{ scheme: 'category10' }}
                lineWidth={1}
                pointSize={3}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={1}
                pointBorderColor={{ from: 'serieColor' }}
                useMesh={true}
                tooltip={ToolTip}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 5,
                        itemWidth: 80,
                        itemHeight: 12,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                    }
                ]}
            />
        </div>
    )
}
