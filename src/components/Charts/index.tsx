import { useCallback, useEffect, useRef, useState } from "react";
import type { ECharts } from "echarts";

import ReactECharts from "echarts-for-react";

function formatValue(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)} dB`;
}

function buildOption(labels: string[], values: number[], min: number, max: number, color: string) {
  const styles = getComputedStyle(document.documentElement);
  const fontFamily = styles.getPropertyValue("--font-family").trim();
  const textColor = styles.getPropertyValue("--text-color").trim();
  const linecolor = styles.getPropertyValue("--background-hover").trim();
  const linecolorCenter = styles.getPropertyValue("--text-color").trim();

  return {
    animation: false,
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    tooltip: { show: false },
    xAxis: {
      type: "category",
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: linecolor } },
      axisTick: { show: false },
      axisLabel: { color: textColor, fontSize: 13, fontFamily, margin: 25 },
      splitLine: { show: true, lineStyle: { color: linecolor } },
    },
    yAxis: {
      type: "value",
      min,
      max,
      interval: (max - min) / 8,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: textColor,
        fontFamily,
        fontSize: 13,
        margin: 20,
        formatter: (value: number) => (value > 0 ? `+${value}` : value),
      },
      splitLine: { lineStyle: { color: linecolor, type: "dashed" } },
    },
    series: [
      {
        type: "line",
        data: values,
        symbol: "circle",
        symbolSize: 9,
        itemStyle: { color, borderColor: color, borderWidth: 2 },
        lineStyle: { width: 2.4, color },
        emphasis: { disabled: true },
        blur: { itemStyle: { color } },
        select: { itemStyle: { color } },
        smooth: true,
        animation: false,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${color}8c` },
              { offset: 0.5, color: `${color}40` },
              { offset: 1, color: `${color}05` },
            ],
          },
        },
        markLine: {
          symbol: "none",
          silent: true,
          animation: false,
          lineStyle: { color: linecolorCenter, type: "dashed", width: 1 },
          label: { show: false },
          data: [{ yAxis: 0 }],
        },
      },
    ],
  };
}

interface ChartProps {
  labels: string[];
  values: number[];
  min?: number;
  max?: number;
  color?: string;
  formatTooltip?: (value: number) => string;
  onChange?: (values: number[]) => void;
  onChangeCommitted?: (values: number[]) => void;
}

export default function Chart({
  labels,
  values,
  min = -12,
  max = 12,
  color = "#db462b",
  formatTooltip = formatValue,
  onChange,
  onChangeCommitted,
}: ChartProps) {
  const [chartInstance, setChartInstance] = useState<ECharts | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const valuesRef = useRef<number[]>(values);
  const draggingRef = useRef<number | null>(null);

  useEffect(() => {
    valuesRef.current = [...values];

    chartInstance?.setOption({
      xAxis: { data: labels },
      series: [{ data: valuesRef.current }],
    });
  }, [chartInstance, values, labels]);

  const getNearestIndex = useCallback(
    (x: number) => {
      if (!chartInstance) return 0;

      let nearest = 0;
      let nearestDistance = Infinity;

      for (let i = 0; i < labels.length; i++) {
        const px = chartInstance.convertToPixel({ xAxisIndex: 0 }, i) as number;
        const distance = Math.abs(px - x);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = i;
        }
      }

      return nearest;
    },
    [chartInstance, labels],
  );

  const updateTooltip = useCallback(
    (index: number) => {
      if (!chartInstance) return;
      const position = chartInstance.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [index, valuesRef.current[index]]) as [number, number];

      setHoveredIndex(index);
      setTooltipPosition({ x: position[0], y: position[1] });
    },
    [chartInstance],
  );

  const setValue = useCallback(
    (index: number, y: number) => {
      if (!chartInstance) return;

      const raw = chartInstance.convertFromPixel({ yAxisIndex: 0 }, y) as number;
      const value = Math.max(min, Math.min(max, Math.round(raw * 10) / 10));

      valuesRef.current[index] = value;

      chartInstance.setOption({ series: [{ data: valuesRef.current }] });
      updateTooltip(index);
      onChange?.([...valuesRef.current]);
    },
    [chartInstance, min, max, updateTooltip, onChange],
  );

  useEffect(() => {
    if (!chartInstance) return;

    const dom = chartInstance.getDom();
    const getPoint = (event: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onMouseDown = (event: MouseEvent) => {
      const { x, y } = getPoint(event);
      const index = getNearestIndex(x);
      draggingRef.current = index;
      setValue(index, y);
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      const isInside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;

      if (!isInside) {
        if (draggingRef.current === null) setHoveredIndex(null);
        return;
      }

      const { x, y } = getPoint(event);

      if (draggingRef.current !== null) {
        event.preventDefault();
        setValue(draggingRef.current, y);
        return;
      }

      updateTooltip(getNearestIndex(x));
    };

    const onMouseUp = () => {
      if (draggingRef.current === null) return;
      draggingRef.current = null;
      onChangeCommitted?.([...valuesRef.current]);
    };

    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [chartInstance, getNearestIndex, setValue, updateTooltip, onChangeCommitted]);

  return (
    <div className="relative h-80 w-full select-none mt-5">
      <ReactECharts
        option={buildOption(labels, valuesRef.current, min, max, color)}
        opts={{ renderer: "svg" }}
        onChartReady={setChartInstance}
        style={{ width: "100%", height: "100%" }}
      />

      {hoveredIndex !== null && (
        <span
          data-slot="slider-tooltip"
          className="bg-text text-background pointer-events-none absolute rounded px-1.5 py-0.5 text-sm whitespace-nowrap shadow-sm"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translate(-50%, calc(-100% - 12px))",
          }}
        >
          {formatTooltip(valuesRef.current[hoveredIndex])}
          <span className="bg-text absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45" />
        </span>
      )}
    </div>
  );
}
