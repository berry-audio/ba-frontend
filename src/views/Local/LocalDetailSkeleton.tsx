import ListItemSkeleton from "@/components/Item/ListItemSkeleton";

const LocalDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="w-60 h-60 bg-white dark:bg-neutral-950 rounded-md" />
        </div>
        <div className="px-3">
          <div className="h-10 bg-neutral-200 dark:bg-neutral-950  rounded w-2/3 mx-auto mb-1 mt-2" />
          <div className="h-5 bg-neutral-200 dark:bg-neutral-950  rounded w-1/2 mx-auto mb-1" />
          <div className="h-5 bg-neutral-200 dark:bg-neutral-950  rounded w-1/3 mx-auto mb-3" />
          <div className="flex items-center justify-center my-3 space-x-3">
            <div className="h-12 w-30 bg-neutral-200 dark:bg-neutral-950  rounded-full" />
            <div className="h-12 w-40 bg-neutral-200 dark:bg-neutral-950  rounded-full" />
            <div className="h-12 w-12 bg-neutral-200 dark:bg-neutral-950  rounded-full" />
          </div>
        </div>
      </div>
      <div className="w-full mt-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default LocalDetailSkeleton;
