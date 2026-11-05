type SpinnerProps = {
  size?: "sm" | "md" | "lg" | "xl";
};

const Spinner = ({ size = "md" }: SpinnerProps) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className={`animate-spin rounded-full border-2 border-t-transparent dark:border-white  border-neutral-950 bg-loader ${sizes[size]} `} />
    </div>
  );
};

export default Spinner;
