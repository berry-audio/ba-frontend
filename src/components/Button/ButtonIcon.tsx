import React from "react";

const ButtonIcon = ({
  children,
  className,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
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
};

export default ButtonIcon;
