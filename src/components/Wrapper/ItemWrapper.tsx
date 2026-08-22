import React from "react";

const ItemWrapper = ({ children, highlight = false, onClick }: { children: React.ReactNode; highlight?: boolean; onClick?: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={`flex justify-between items-center w-full cursor-pointer hover:bg-hover rounded-none lg:rounded-md transition-all duration-200 ${highlight ? "bg-selected" : ""}`}
    >
      {children}
    </div>
  );
};

export default ItemWrapper;
