import React from "react";

const TruncateText = ({
  children,
  limit,
  className = "",
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  limit?: number;
}) => {
  if (limit && typeof children === "string") {
    const truncated = children.length > limit ? children.slice(0, limit) + "…" : children;
    return <span className={`block ${className}`}>{truncated}</span>;
  }

  return (
    <span className={`block overflow-hidden text-ellipsis whitespace-nowrap ${className}`}>
      {children}
    </span>
  );
};

export default TruncateText;