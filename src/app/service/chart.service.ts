import { Injectable } from '@angular/core';
import {WindData} from "../model/WindData";
import {WaveData} from "../model/WaveData";
import echarts from "echarts/types/dist/echarts";
import {EChartsOption} from "echarts";

@Injectable({
  providedIn: 'root'
})
export class ChartService {
    windSpeedColor = 'rgba(252,100,225,0.98)';
    waveHeightColor = 'rgb(97,234,193)';

    // chartOption: EChartsOption = {};
    filterChartOption: EChartsOption = {};




  constructor() { }

  formatDateTime(value: Date): string {
    const padZero = (num: number) => num < 10 ? `0${num}` : num.toString();
    return `${padZero(value.getDate())} ${value.toLocaleString('en-US', { month: 'short' })}, ${padZero(value.getHours())}h`;
  }

  updateChart(windData: WindData, waveData: WaveData, chartOption: EChartsOption) {
    if (windData && windData.hourly && waveData && waveData.hourly) {
      const timeData = windData.hourly.time;
      const windSpeedData = windData.hourly.wind_speed_10m;
      const waveHeightData = waveData.hourly.wave_height;
      const windDirectionData = windData.hourly.wind_direction_10m;

      const arrowSize = 16; // Define the size of the arrow
      const renderArrow: echarts.CustomSeriesOption['renderItem'] = (param, api) => {
        const windDirection = windData?.hourly?.wind_direction_10m[param.dataIndex] ?? 0;
        const point = api.coord([timeData[param.dataIndex],
          windSpeedData[param.dataIndex]

        ]);

        return {
          type: 'path',
          shape: {
            pathData: 'M31 16l-15-15v9h-26v12h26v9z', // Define the arrow shape
            x: -arrowSize / 2,
            y: -arrowSize / 2,
            width: arrowSize,
            height: arrowSize
          },
          rotation: (270 - windDirection) * (Math.PI / 180), // Convert degrees to radians,
          position: point,
          style: api.style({
            stroke: '#555',
            lineWidth: 0
          })
        };
      };

      chartOption = {
        title: {
          text: '',
          textStyle: {
            fontSize: 14, // Set your desired font size here
            color: 'white'
          },
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params: any) {
            const dateTime = new Date(params[0].axisValueLabel);

            const padZero = (num: any) => (num < 10 ? `0${num}` : num);
            const formattedDate = `${padZero(dateTime.getDate())} ${dateTime.toLocaleString('en-US', { month: 'short' })}, ${padZero(dateTime.getHours())}h`;

            // let dateAndTime = params[0].axisValueLabel; // Datum und Uhrzeit
            let windSpeed = params.find((p: any) => p.seriesName === 'Wind Speed');
            let windDirection = params.find((p: any) => p.seriesType === 'custom');
            let waveHeight = params.find((p: any) => p.seriesName === 'Wave Height');

            let result = formattedDate;
            if (windSpeed) {
              result += `<br/><span style="color: ${windSpeed.color}">●</span> Wind Speed: ${windSpeed.data} kts`;
            }
            if (windDirection) {
              let windDirectionValue = windDirectionData[params[0].dataIndex];
              result += `<br/><span style="color: blue">●</span> Wind Direction: ${windDirectionValue} °`;
            }
            if (waveHeight) {
              result += `<br/><span style="color: ${waveHeight.color}">●</span> Wave Height: ${waveHeight.data} m`;
            }

            return result;
          }

        },


        xAxis: {
          type: 'category',
          data: timeData,
          axisLabel: {
            formatter: (value: string) => {
              // Format the display of date-time labels as needed
              return value; // Placeholder, adjust date formatting as necessary



            }
          }
        },
        yAxis: [{
          type: 'value',
          name: 'Wind Speed (knots)',
          nameLocation: 'middle',
          nameGap: 35,
          axisLine: {
            lineStyle: {
              color: this.windSpeedColor
            }
          },


        },
          {
            name: 'Wave height',
            nameLocation: 'middle',
            nameGap: 35,
            max: 10,
            axisLine: {
              lineStyle: {
                color: this.waveHeightColor
              }
            },
            splitLine: {show: false}
          },
          {
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {show: false},
            splitLine: {show: false}

          }],
        series: [
          {
            name: 'Wind Speed',
            yAxisIndex: 0,
            type: 'line',
            lineStyle: {
              color: this.windSpeedColor
            },
            itemStyle: {
              color: this.windSpeedColor
            },
            data: windSpeedData,
            smooth: true
          },
          {
            type: 'custom',
            renderItem: renderArrow,
            data: timeData.map((_, idx) => [
              timeData[idx],
              windSpeedData[idx]

            ]),
            z: 100
          },
          {
            name: 'Wave Height',
            yAxisIndex: 1,
            type: 'line',
            lineStyle: {
              color: this.waveHeightColor
            },
            itemStyle: {
              color: this.waveHeightColor
            },
            data: waveHeightData,
            smooth: true
          },

        ]
      };
      return chartOption;
    }
    return null;
  }
}
