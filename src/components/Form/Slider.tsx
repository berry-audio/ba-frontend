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
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  showTicks?: boolean;
  showLabels?: boolean;
  showTooltip?: boolean;
  tickInterval?: number;
  unit?: string;
}) {
  const [internalValues, setInternalValues] = useState<number[]>(
    Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const _values = useMemo(() => (Array.isArray(value) ? value : internalValues), [value, internalValues]);

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
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track data-slot="slider-track" className={"bg-foreground cursor-pointer relative grow overflow-hidden h-1.5 rounded-full"}>
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn("bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full")}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="border-primary bg-background ring-ring/50 relative block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
            onPointerEnter={() => setHoveredIndex(index)}
            onPointerLeave={() => setHoveredIndex(null)}
            onPointerDown={() => setActiveIndex(index)}
            onPointerUp={() => setActiveIndex(null)}
          >
            {showTooltip && (activeIndex === index || hoveredIndex === index) && (
              <span
                data-slot="slider-tooltip"
                className="bg-text text-background pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded px-1.5 py-0.5 text-sm whitespace-nowrap shadow-sm"
              >
                {_values[index]}
                {unit}
                <span className="bg-text absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45" />
              </span>
            )}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>

      {showTicks && ticks.length > 0 && (
        <div className="px-2">
          <div className="relative mt-3 h-1 w-full">
            {ticks.map((tick) => {
              const percent = ((tick - min) / (max - min)) * 100;
              return <span key={tick} data-slot="slider-tick" className="bg-text absolute top-0 h-1 w-px" style={{ left: `${percent}%` }} />;
            })}
          </div>
        </div>
      )}

      {showLabels && ticks.length > 0 && (
        <div className="relative mt-0.5 h-4 w-full text-xs ml-px">
          {ticks.map((tick) => {
            const percent = ((tick - min) / (max - min)) * 100;
            const translate = percent <= 0 ? "translate-x-0" : percent >= 100 ? "-translate-x-full" : "-translate-x-1/2";
            return (
              <span
                key={tick}
                data-slot="slider-tick-label"
                className={cn("absolute top-0 whitespace-nowrap", translate)}
                style={{ left: `${percent}%` }}
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
