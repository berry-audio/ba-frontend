import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  showTicks = false,
  showLabels = false,
  showTooltip = true,
  tickInterval,
  unit = "",
  height = 5,
  rounded = true,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  value: number[];
  showTicks?: boolean;
  showLabels?: boolean;
  showTooltip?: boolean;
  tickInterval?: number;
  unit?: string;
  height?: number;
  rounded?: boolean;
}) {
  const [internalValues, setInternalValues] = useState<number[]>(
    Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const _values = Array.isArray(value) ? value : internalValues;
  const percentages = _values.map((v) => ((v - min) / (max - min)) * 100);

  const ticks = useMemo(() => {
    const interval = tickInterval ?? step;
    if ((!showTicks && !showLabels) || !interval || interval <= 0) return [];
    const count = Math.floor((max - min) / interval);
    const result: number[] = [];
    for (let i = 0; i <= count; i++) {
      result.push(min + i * interval);
    }
    if (result[result.length - 1] !== max) {
      result.push(max);
    }
    return result;
  }, [showTicks, showLabels, min, max, step, tickInterval]);

  function getRangeWidth(percentage: number) {
    const clamped = Math.max(0, Math.min(100, percentage));
    const maxBuffer = 0;
    const fadeEnd = 100;

    if (clamped >= fadeEnd) return clamped;

    const buffer = maxBuffer * (1 - Math.log(clamped + 1) / Math.log(fadeEnd + 1));
    return clamped + buffer;
  }

  return (
    <div className="w-full">
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => {
          setInternalValues(v);
          props.onValueChange?.(v);
        }}
        className={cn(
          "relative flex w-full touch-none items-center select-none",
          "[-webkit-touch-callout:none] [-webkit-user-select:none] [-webkit-tap-highlight-color:transparent]",
          "data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className,
        )}
        onMouseEnter={() => setHoveredIndex(0)}
        onMouseLeave={() => setHoveredIndex(null)}
        onPointerEnter={() => setHoveredIndex(0)}
        onPointerLeave={() => setHoveredIndex(null)}
        onPointerDown={() => setHoveredIndex(0)}
        onPointerUp={() => setHoveredIndex(null)}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={`relative bg-input w-full h-${height} transition-all duration-200 ${hoveredIndex === 0 && !props.disabled && "h-5"} cursor-pointer relative grow rounded-full`}
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
          onPointerEnter={() => setHoveredIndex(0)}
          onPointerLeave={() => setHoveredIndex(null)}
          onPointerDown={() => setHoveredIndex(0)}
          onPointerUp={() => setHoveredIndex(null)}
        >
          {!props.disabled && value.length > 0 && (
            <div
              data-slot="slider-range"
              className={`relative h-full ${rounded ? "rounded-full" : "rounded-tl-none rounded-bl-none rounded-tr-full rounded-br-full"} pointer-events-none bg-primary`}
              style={{
                width: `max(20px, calc(${getRangeWidth(percentages[0])}% + 2px ))`,
              }}
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              onPointerEnter={() => setHoveredIndex(0)}
              onPointerLeave={() => setHoveredIndex(null)}
              onPointerDown={() => setHoveredIndex(0)}
              onPointerUp={() => setHoveredIndex(null)}
            >
              <div
                className={cn(
                  "w-5 h-5 bg-white! border-3 border-primary! absolute right-0 rounded-full transition-all",
                  (hoveredIndex === 0 && !props.disabled) || height === 5
                    ? "opacity-100 scale-100 duration-1000"
                    : "opacity-0 scale-75 pointer-events-none duration-100",
                )}
              >
                {showTooltip && hoveredIndex === 0 && (
                  <span
                    data-slot="slider-tooltip"
                    className="bg-text text-background pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded px-1.5 py-0.5 text-sm whitespace-nowrap shadow-sm z-50"
                  >
                    {_values[0]}
                    {unit}
                    <span className="bg-text absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45" />
                  </span>
                )}
              </div>
            </div>
          )}
        </SliderPrimitive.Track>

        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative outline-none block"
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
            onPointerEnter={() => setHoveredIndex(0)}
            onPointerLeave={() => setHoveredIndex(null)}
            onPointerDown={() => setHoveredIndex(0)}
            onPointerUp={() => setHoveredIndex(null)}
          >
            {/* invisible bigger hit area */}
            <span className="absolute -inset-4 z-50 " />
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>

      {showTicks && ticks.length > 0 && (
        <div className="relative mt-3 h-1 w-full">
          {ticks.map((tick) => {
            const percent = ((tick - min) / (max - min)) * 100;
            const adjustedPercent = tick === min ? 0 : getRangeWidth(percent) - 2;
            return <span key={tick} data-slot="slider-tick" className="bg-text absolute top-0 h-1 w-px" style={{ left: `${adjustedPercent}%` }} />;
          })}
        </div>
      )}

      {showLabels && ticks.length > 0 && (
        <div className="relative mt-0.5 h-4 w-full text-xs">
          {ticks.map((tick) => {
            const percent = ((tick - min) / (max - min)) * 100;
            const adjustedPercent = tick === min ? 0 : getRangeWidth(percent) - 2;
            return (
              <span
                key={tick}
                data-slot="slider-tick-label"
                className="absolute top-0 whitespace-nowrap -translate-x-1/2"
                style={{ left: `${adjustedPercent}%` }}
              >
                {tick}
                {unit}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { Slider };
