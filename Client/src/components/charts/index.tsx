import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

// Your data
// prettier-ignore
const data = [
  ["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135],
  ["2000-06-08", 86],  ["2000-06-09", 73],  ["2000-06-10", 85],
  ["2000-06-11", 73],  ["2000-06-12", 68],  ["2000-06-13", 92],
  ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139],
  ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309],
  ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128],
  ["2000-06-23", 85],  ["2000-06-24", 94],  ["2000-06-25", 71],
  ["2000-06-26", 106], ["2000-06-27", 84],  ["2000-06-28", 93],
  ["2000-06-29", 85],  ["2000-06-30", 73],  ["2000-07-01", 83],
  ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82],
  ["2000-07-05", 44],  ["2000-07-06", 72],  ["2000-07-07", 106],
  ["2000-07-08", 107], ["2000-07-09", 66],  ["2000-07-10", 91],
  ["2000-07-11", 92],  ["2000-07-12", 113], ["2000-07-13", 107],
  ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64],
  ["2000-07-17", 69],  ["2000-07-18", 88],  ["2000-07-19", 77],
  ["2000-07-20", 83],  ["2000-07-21", 111], ["2000-07-22", 57],
  ["2000-07-23", 55],  ["2000-07-24", 60],
];                                                                                             

const dateList = data.map((item) => item[0]);
const valueList = data.map((item) => item[1]);

const RevenueChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      const option: echarts.EChartsOption = {
        title: {
          text: "Revenue Over Time",
          left: "center",
          textStyle: { fontSize: 16, fontWeight: "bold" },
        },
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            const item = params[0];
            return `${item.axisValue}<br/>Revenue: $${item.data}`;
          },
        },
        xAxis: {
          type: "category",
          data: dateList,
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          axisLabel: { formatter: (v) => `$${v}` },
          splitLine: { lineStyle: { type: "dashed", color: "#ddd" } },
        },
        series: [
          {
            type: "line",
            data: valueList,
            // smooth: true,
            showSymbol: false,
            lineStyle: { width: 3, color: "#4bc0c0" },
            itemStyle: { color: "#4bc0c0" },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(75,192,192,0.4)" },
                { offset: 1, color: "rgba(75,192,192,0.05)" },
              ]),
            },
          },
        ],
        grid: { left: "", right: "5%", bottom: "10%", containLabel: true },
      };

      chart.setOption(option);
      window.addEventListener("resize", () => chart.resize());

      return () => {
        chart.dispose();
        window.removeEventListener("resize", () => chart.resize());
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default RevenueChart;
    