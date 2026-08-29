import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const ButtonIcon = ({
  children,
  className,
  disabled = false,
  onClick,
  tooltip,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  tooltip?: string;
}) => {
  const button = (
    <button
      className={`text-neutral-950 dark:text-white cursor-pointer flex hover:bg-hover w-10 h-10 items-center justify-center rounded-full disabled:opacity-30 transition-all duration-200 ${className ? className : ""} `}
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick(e);
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );

  if (!tooltip) return button;

  return (
    <TooltipPrimitive.Provider delayDuration={1000}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{button}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            sideOffset={6}
            className="z-50 rounded-md bg-neutral-900 dark:bg-white px-2.5 py-1.5 text-xs font-medium text-white dark:text-neutral-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1"
          >
            {tooltip}
            <TooltipPrimitive.Arrow className="fill-neutral-900 dark:fill-white" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default ButtonIcon;
