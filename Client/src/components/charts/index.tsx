import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RevenueAnalyticsState } from "@/pages/instructor-view/revenue/revenue";

type ChartProps = {
  data: [string, number][];
  minDate: Date;
  setAnalyticsState: React.Dispatch<React.SetStateAction<RevenueAnalyticsState>>;
  analyticsState: RevenueAnalyticsState;
  title: string
  valName: string
};

const RevenueChart: React.FC<ChartProps> = ({ data, setAnalyticsState, analyticsState, minDate, title, valName }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const [isLeftChevronDisabled, setIsLeftChevronDisabled] = useState(false);
  const [isRightChevronDisabled, setIsRightChevronDisabled] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Update chevron disabled state
  const updateChevronStates = () => {
    const firstDate = new Date(minDate);
    const minMonth = firstDate.getMonth();
    const minYear = firstDate.getFullYear();

    setIsLeftChevronDisabled(
      analyticsState.year === minYear && analyticsState.monthToShowRevenue === minMonth
    );

    setIsRightChevronDisabled(
      analyticsState.year === currentYear && analyticsState.monthToShowRevenue === currentMonth
    );
  };

  const changeYear = (type: 'Add' | 'sub') => {
    setAnalyticsState(prev => ({
      ...prev,
      year: type === 'Add' ? prev.year + 1 : prev.year - 1
    }))
  }

  // Change month
  const handleClick_ChangeMonth = (type: "Add" | "sub") => {
    setAnalyticsState((prev) => {
      if ((prev.monthToShowRevenue === 11 && type === 'Add') || (prev.monthToShowRevenue === 0 && type === 'sub')) {
        changeYear(type)
      }
      const newMonth =
        type === "Add" ? prev.monthToShowRevenue === 11 ? 0
          : prev.monthToShowRevenue + 1
          : prev.monthToShowRevenue === 0
            ? 11
            : prev.monthToShowRevenue - 1;

      return {
        ...prev,
        monthToShowRevenue: newMonth,
      };
    });
  };

  // Update chevrons whenever analyticsState changes
  useEffect(() => {
    if (!analyticsState) return;
    updateChevronStates();
  }, [analyticsState]);

  // Render chart and update on data change
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const dateList = data.map((item) => item[0]);
    const valueList = data.map((item) => item[1]);

    const option: echarts.EChartsOption = {
      title: {
        text: title,
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          const item = params[0];
          return `${item.axisValue}<br/>${valName}${item.data}`;
        },
      },
      xAxis: { type: "category", data: dateList, boundaryGap: false },
      yAxis: {
        type: "value",
        axisLabel: { formatter: (v) => `$${v}` },
        splitLine: { lineStyle: { type: "dashed", color: "#ddd" } },
      },
      series: [
        {
          type: "line",
          data: valueList,
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
      grid: { left: "5%", right: "5%", bottom: "10%", containLabel: true },
    };

    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());

    return () => {
      chart.dispose();
      window.removeEventListener("resize", () => chart.resize());
    };
  }, [data]); // re-render chart whenever data changes

  return (
    <div className="flex items-center">
      <ChevronLeft
        className={`transition-colors ${isLeftChevronDisabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-700 hover:text-gray-900 cursor-pointer"
          }`}
        onClick={() => {
          if (!isLeftChevronDisabled) handleClick_ChangeMonth("sub");
        }}
      />

      <div ref={chartRef} style={{ width: "100%", height: "400px" }} className="mx-4" />

      <ChevronRight
        className={`transition-colors ${isRightChevronDisabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-700 hover:text-gray-900 cursor-pointer"
          }`}
        onClick={() => {
          if (!isRightChevronDisabled) handleClick_ChangeMonth("Add");
        }}
      />
    </div>
  );
};

export default RevenueChart;
