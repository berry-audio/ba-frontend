import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface InputNumberProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const round = (num: number) => Math.round(num * 1e10) / 1e10;
const getDecimals = (step: number) => (step.toString().split(".")[1] || "").length;

const toSafeNumber = (val: unknown, fallback: number) => {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
};

export function InputNumber({ value, min = 1, max = 10000, step = 1, onChange, disabled = false }: InputNumberProps) {
  const decimals = getDecimals(step);
  const safeValue = toSafeNumber(value, min);

  const [text, setText] = useState(safeValue.toFixed(decimals));

  useEffect(() => {
    setText(safeValue.toFixed(decimals));
  }, [value, decimals]);

  const updateValue = (newValue: number) => {
    const clamped = Math.min(Math.max(round(newValue), min), max);
    onChange(clamped);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex">
        <Button type="button" onClick={() => updateValue(safeValue - step)} className="rounded-r-none h-full px-3" disabled={disabled}>
          −
        </Button>
        <Input
          type="number"
          value={text}
          step={step}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            const val = Number(text);
            if (!isNaN(val)) updateValue(val);
            else setText(safeValue.toFixed(decimals));
          }}
          className="flex-1 min-w-0 text-center rounded-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
          disabled={disabled}
        />
        <Button type="button" onClick={() => updateValue(safeValue + step)} className="rounded-l-none h-full px-3" disabled={disabled}>
          +
        </Button>
      </div>
    </div>
  );
}
