import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchJsonRpc } from "@/util";
import { GearIcon, TrashIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import type { ECharts } from "echarts";

import ButtonIcon from "@/components/Button/ButtonIcon";
import ReactECharts from "echarts-for-react";

const G_MIN = -12;
const G_MAX = 12;

function bandFrequency(fmin: number, fmax: number, nbrBands: number, band: number) {
  const fMinLog = Math.log(fmin) / Math.log(2);
  const fMaxLog = Math.log(fmax) / Math.log(2);
  const bw = (fMaxLog - fMinLog) / nbrBands;
  const freqLog = fMinLog + (band + 0.5) * bw;
  return Math.pow(2, freqLog);
}

function formatBandValue(freq: number) {
  if (freq < 10) return freq.toFixed(1);
  if (freq < 1000) return freq.toFixed(0);
  if (freq < 10000) return `${(freq / 1000).toFixed(1)}k`;
  return `${(freq / 1000).toFixed(0)}k`;
}

function formatGain(gain: number) {
  return `${gain > 0 ? "+" : ""}${gain.toFixed(1)} dB`;
}

function buildOption(labels: string[], gains: number[]) {
  const styles = getComputedStyle(document.documentElement);
  const fontFamily = styles.getPropertyValue("--font-family").trim();
  const textColor = styles.getPropertyValue("--text-color").trim();
  const linecolor = styles.getPropertyValue("--background-hover").trim();
  const linecolorCenter = styles.getPropertyValue("--text-color").trim();

  return {
    animation: false,
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    tooltip: {
      show: false,
    },
    xAxis: {
      type: "category",
      data: labels,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: linecolor,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: textColor,
        fontSize: 13,
        fontFamily,
        margin: 25,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: linecolor,
        },
      },
    },
    yAxis: {
      type: "value",
      min: G_MIN,
      max: G_MAX,
      interval: 3,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: textColor,
        fontFamily,
        fontSize: 13,
        margin: 20,
        formatter: (value: number) => (value > 0 ? `+${value}` : value),
      },
      splitLine: {
        lineStyle: {
          color: linecolor,
          type: "dashed",
        },
      },
    },
    series: [
      {
        type: "line",
        data: gains,
        symbol: "circle",
        symbolSize: 9,
        itemStyle: {
          color: "#db462b",
          borderColor: "#db462b",
          borderWidth: 2,
        },
        lineStyle: {
          width: 2.4,
          color: "#db462b",
        },
        emphasis: {
          disabled: true,
        },
        blur: {
          itemStyle: {
            color: "#db462b",
          },
        },
        select: {
          itemStyle: {
            color: "#db462b",
          },
        },
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
              {
                offset: 0,
                color: "rgba(219,70,43,0.55)",
              },
              {
                offset: 0.5,
                color: "rgba(219,70,43,0.25)",
              },
              {
                offset: 1,
                color: "rgba(219,70,43,0.02)",
              },
            ],
          },
        },
        markLine: {
          symbol: "none",
          silent: true,
          animation: false,
          lineStyle: {
            color: linecolorCenter,
            type: "dashed",
            width: 1,
          },
          label: {
            show: false,
          },
          data: [
            {
              yAxis: 0,
            },
          ],
        },
      },
    ],
  };
}

export default function Equalizer({ name, filter }: { name: string; filter: any }) {
console.log(filter)

  const [chartInstance, setChartInstance] = useState<ECharts | null>(null);
  const [hoveredBand, setHoveredBand] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
  });

  const chartRef = useRef<ReactECharts>(null);
  const gainsRef = useRef<number[]>([]);
  const draggingRef = useRef<number | null>(null);

  const { initialGains, freqs, labels } = useMemo(() => {
    const params = filter?.parameters;
    const gains = params?.gains ?? [];
    const nbrBands = gains.length;
    const fmin = params?.freq_min ?? 20;
    const fmax = params?.freq_max ?? 20000;
    const freqs = Array.from({ length: nbrBands }, (_, i) => bandFrequency(fmin, fmax, nbrBands, i));

    return {
      initialGains: gains,
      freqs,
      labels: freqs.map(formatBandValue),
    };
  }, [filter]);

  useEffect(() => {
    gainsRef.current = [...initialGains];

    chartInstance?.setOption({
      xAxis: {
        data: labels,
      },
      series: [
        {
          data: gainsRef.current,
        },
      ],
    });
  }, [chartInstance, initialGains, labels]);

  const getNearestBand = useCallback(
    (x: number) => {
      if (!chartInstance) return 0;

      let nearest = 0;
      let nearestDistance = Infinity;

      for (let i = 0; i < freqs.length; i++) {
        const px = chartInstance.convertToPixel({ xAxisIndex: 0 }, i) as number;

        const distance = Math.abs(px - x);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = i;
        }
      }

      return nearest;
    },
    [chartInstance, freqs],
  );

  const updateTooltip = useCallback(
    (index: number) => {
      if (!chartInstance) return;
      const position = chartInstance.convertToPixel(
        {
          xAxisIndex: 0,
          yAxisIndex: 0,
        },
        [index, gainsRef.current[index]],
      ) as [number, number];

      setHoveredBand(index);
      setTooltipPosition({
        x: position[0],
        y: position[1],
      });
    },
    [chartInstance],
  );

  const onCommittedValue = useCallback(async () => {
    const config = await fetchJsonRpc<any>("dsp.get_config", 102);
    const gains = [...gainsRef.current];
    const params = {
      ...config,
      filters: {
        ...config.filters,
        [name]: {
          ...config.filters[name],
          parameters: {
            ...config.filters[name]?.parameters,
            gains,
          },
        },
      },
    };

    await fetchJsonRpc<any>("dsp.set_config", 102, {
      config: params,
    });
  }, [name]);

  const setBandGain = useCallback(
    (index: number, y: number) => {
      if (!chartInstance) return;

      const value = chartInstance.convertFromPixel({ yAxisIndex: 0 }, y) as number;

      const gain = Math.max(G_MIN, Math.min(G_MAX, Math.round(value * 10) / 10));

      gainsRef.current[index] = gain;

      chartInstance.setOption({
        series: [
          {
            data: gainsRef.current,
          },
        ],
      });

      updateTooltip(index);
    },
    [chartInstance, updateTooltip],
  );

  useEffect(() => {
    if (!chartInstance) return;

    const dom = chartInstance.getDom();
    const getPoint = (event: MouseEvent) => {
      const rect = dom.getBoundingClientRect();

      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const onMouseDown = (event: MouseEvent) => {
      const { x, y } = getPoint(event);
      const index = getNearestBand(x);

      draggingRef.current = index;
      setBandGain(index, y);
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = dom.getBoundingClientRect();

      const isInside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;

      if (!isInside) {
        if (draggingRef.current === null) {
          setHoveredBand(null);
        }

        return;
      }

      const { x, y } = getPoint(event);

      if (draggingRef.current !== null) {
        event.preventDefault();
        setBandGain(draggingRef.current, y);
        return;
      }

      const index = getNearestBand(x);
      updateTooltip(index);
    };

    const onMouseUp = () => {
      if (draggingRef.current === null) {
        return;
      }

      draggingRef.current = null;
      void onCommittedValue();
    };

    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [chartInstance, getNearestBand, setBandGain, updateTooltip, onCommittedValue]);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <div>{name}</div>
        <div className="flex">
          <ButtonIcon onClick={undefined}>
            <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />
          </ButtonIcon>

          <ButtonIcon onClick={undefined}>
            <TrashIcon weight={ICON_WEIGHT} size={ICON_SM} />
          </ButtonIcon>
        </div>
      </div>

      <div className="relative h-80 w-full select-none">
        <ReactECharts
          ref={chartRef}
          option={buildOption(labels, gainsRef.current)}
          opts={{
            renderer: "svg",
          }}
          onChartReady={setChartInstance}
          style={{
            width: "100%",
            height: "100%",
          }}
        />

        {hoveredBand !== null && (
          <span
            data-slot="slider-tooltip"
            className="bg-text text-background pointer-events-none absolute rounded px-1.5 py-0.5 text-sm whitespace-nowrap shadow-sm"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: "translate(-50%, calc(-100% - 12px))",
            }}
          >
            {formatGain(gainsRef.current[hoveredBand])}
            <span className="bg-text absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45" />
          </span>
        )}
      </div>
    </div>
  );
}
