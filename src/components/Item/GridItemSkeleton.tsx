import { CSSProperties } from "react";

const GridItemSkeleton = ({ style }: { style?: CSSProperties }) => {
  return (
    <div style={style} className="relative p-2 lg:p-3 pb-6 rounded-md animate-pulse">
      <div className="w-full">
        <div className="w-full aspect-square rounded-md bg-white dark:bg-neutral-950" />
        <div className="flex justify-between mt-2">
          <div className="overflow-hidden text-left w-full pr-2">
            <div className="h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-950 mb-2 mt-1" />
            <div className="h-5 w-1/2 rounded bg-neutral-200 dark:bg-neutral-950" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridItemSkeleton;
