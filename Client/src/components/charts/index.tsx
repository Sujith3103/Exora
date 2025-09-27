import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RevenueAnalyticsState } from "@/pages/instructor-view/revenue/revenue";

type ChartProps = {
  data: [string, number][]
  //the lowest limit until where the user can look his data -> minDate
  minDate: Date
  month: number
  setAnalyticsState: React.Dispatch<React.SetStateAction<RevenueAnalyticsState>>;
  analyticsState: RevenueAnalyticsState
}

const RevenueChart: React.FC<ChartProps> = ({ data, month, setAnalyticsState, analyticsState, minDate }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const [isLeftChevronDisabled, setIsLeftChevronDisabled] = useState<boolean>(false)
  const [isRightChevronDisabled, setIsRightChevronDisabled] = useState<boolean>(false)

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const dateList = data.map((item) => item[0]);
  const valueList = data.map((item) => item[1]);

  const handleClick_ChangeMonth = (type: 'Add' | 'sub') => {

    setAnalyticsState(prev => {
      if (prev.monthToShowRevenue === 11 && type === 'Add') {

      }
      const newMonth = type === 'Add'
        ? prev.monthToShowRevenue === 11 ? 0 : prev.monthToShowRevenue + 1
        : prev.monthToShowRevenue === 0 ? 11 : prev.monthToShowRevenue - 1;

      return {
        ...prev,               // keep other properties like showBy
        monthToShowRevenue: newMonth
      };
    });


    // setMonth(prev => {
    //   if (type === 'Add') {
    //     return prev === 11 ? 0 : prev + 1;   // Wrap around after December
    //   } else {
    //     return prev === 0 ? 11 : prev - 1;   // Wrap around before January
    //   }
    // });

  };

  const calcIfIconDisables = () => {

  }

  const isRightIconDisabled = () => {
    if (analyticsState?.year === currentYear && analyticsState?.monthToShowRevenue === currentMonth) {
      setIsRightChevronDisabled(true)
    }
    else {
      setIsRightChevronDisabled(false)
    }
  }

  const isLeftIconDisabled = () => {
    const firstDate = new Date(minDate);
    const month = firstDate?.getMonth()
    const year = firstDate?.getFullYear()
    if (analyticsState.year === year && analyticsState.monthToShowRevenue === month) {
      setIsLeftChevronDisabled(true)
    }
    else {
      setIsLeftChevronDisabled(false)
    }
  }

  useEffect(() => {
    if (!analyticsState) return
    isRightIconDisabled()
    isLeftIconDisabled()
  }, [analyticsState])

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

  return <div className="flex items-center">
    <ChevronLeft
      className={`transition-colors ${isLeftChevronDisabled
        ? "text-gray-400 cursor-not-allowed"  // disabled styling
        : "text-gray-700 hover:text-gray-900 cursor-pointer"  // active styling
        }`}
      onClick={() => {
        if (!isLeftChevronDisabled) handleClick_ChangeMonth("sub");
      }}
    />
    <div ref={chartRef} style={{ width: "100%", height: "400px", }} className="ml-7" />
    <ChevronRight
      className={`transition-colors ${isRightChevronDisabled
        ? "text-gray-400 cursor-not-allowed"  // disabled styling
        : "text-gray-700 hover:text-gray-900 cursor-pointer"  // active styling
        }`}
      onClick={() => {
        if (!isRightChevronDisabled) handleClick_ChangeMonth("Add");
      }}
    />
  </div>
};

export default RevenueChart;
