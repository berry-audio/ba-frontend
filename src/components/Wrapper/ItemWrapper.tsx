import React from "react";

const ItemWrapper = ({ children, highlight= false }: { children: React.ReactNode, highlight?: boolean  }) => {
  return (
    <div className={`flex justify-between items-center w-full cursor-pointer hover:bg-button-hover rounded-none lg:rounded-md transition-all duration-200 ${highlight ? "bg-selected" : ""}`}>
      {children}
    </div>
  );
};

export default ItemWrapper;
