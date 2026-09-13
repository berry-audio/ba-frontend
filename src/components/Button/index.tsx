import React from "react";
import { cn } from "@/lib/utils"; // adjust path to wherever your cn is defined

const Button = ({
  loading,
  children,
  type = "ghost",
  size = "md",
  onClick,
  disabled,
  className = "",
}: {
  loading?: boolean;
  children: React.ReactNode;
  type: "ghost" | "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <button
      type="submit"
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick();
      }}
      disabled={disabled}
      className={cn(
        "transition flex items-center rounded-full cursor-pointer",
        size === "md" && "px-6 py-3.5",
        size === "sm" && "px-5 py-2.5",
        type === "ghost" && "hover:bg-hover disabled:opacity-50",
        type === "primary" && "bg-primary hover:bg-primary/90",
        type === "secondary" && "bg-foreground hover:bg-foreground/10",
        type === "outline" && "border-2 border-(--background-invert) hover:bg-foreground/10",
        loading && "disabled:opacity-50",
        className,
      )}
    >
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin mr-2 rounded-full h-3 w-3 border-2 bg-loader"></div>
        </div>
      )}
      {children}
    </button>
  );
};

export default Button;
