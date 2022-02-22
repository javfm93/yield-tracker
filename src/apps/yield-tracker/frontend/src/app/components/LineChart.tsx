import * as React from 'react';
import { Line } from '@nivo/line';

export function LineChart({ data }) {
  const commonProperties = {
    width: 900,
    height: 400,
    margin: { top: 20, right: 20, bottom: 60, left: 80 },
    animate: true,
    enableSlices: 'x',
  };
  return (
    <Line
      {...commonProperties}
      data={[
        {
          id: 'BUNNY',
          data: data,
        },
      ]}
      xScale={{
        type: 'time',
        format: '%d/%m/%Y',
        useUTC: false,
        precision: 'day',
      }}
      xFormat="time:%d/%m/%Y"
      yScale={{
        type: 'linear',
      }}
      axisLeft={{
        legend: 'linear scale',
        legendOffset: 12,
      }}
      axisBottom={{
        format: '%b %d',
        tickValues: 'every 7 days',
        legend: 'time scale',
        legendOffset: -12,
      }}
      enablePointLabel={true}
      pointSize={16}
      pointBorderWidth={1}
      pointBorderColor={{
        from: 'color',
        modifiers: [['darker', 0.3]],
      }}
      useMesh={true}
      enableSlices={false}
    />
  );
}
