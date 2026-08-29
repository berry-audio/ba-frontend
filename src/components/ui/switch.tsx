import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  inverted?: boolean;
}

export function Switch({ value = false, onChange, disabled, inverted = false }: SwitchProps) {
  const checked = inverted ? !value : value;

  const handleCheckedChange = (checkedState: boolean) => {
    onChange(inverted ? !checkedState : checkedState);
  };

  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
      className={cn(
        "cursor-pointer peer data-[state=checked]:bg-primary bg-cover data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-hover focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "bg-white data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-foreground pointer-events-none block h-6 w-6 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
