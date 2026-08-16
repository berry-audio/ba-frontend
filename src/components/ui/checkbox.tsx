import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ value = false, onChange, disabled }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      checked={value}
      onCheckedChange={(checked: boolean) => onChange(checked === true)}
      disabled={disabled}
      className={cn(
        "cursor-pointer peer data-[state=checked]:bg-primary data-[state=checked]:border-primary bg-cover dark:bg-hover  focus-visible:ring-ring/50 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
