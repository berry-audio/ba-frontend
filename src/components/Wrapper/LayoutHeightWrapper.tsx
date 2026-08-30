import React, { forwardRef } from "react";

interface LayoutHeightWrapper {
  children: React.ReactNode;
  className?: string;
}

const LayoutHeightWrapper = forwardRef<HTMLDivElement, LayoutHeightWrapper>(({ children, className }, ref) => {
  return (
    <div ref={ref} className={`h-[calc(100dvh-180px)] lg:h-[calc(100dvh-195px)] overflow-y-auto overflow-x-hidden ${className ?? ""}`}>
      {children}
    </div>
  );
});

export default LayoutHeightWrapper;
