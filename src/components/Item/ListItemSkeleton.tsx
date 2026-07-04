import ListImageWrapper from "../Wrapper/ListImageWrapper";

const ListItemSkeleton = () => {
  return (
    <div className="flex items-center w-full justify-between relative animate-pulse">
      <div className="py-3 px-4 flex justify-between w-full items-center">
        <div className="flex items-center w-full">
          <ListImageWrapper>
            <div className="w-full rounded-md bg-white dark:bg-neutral-950 h-12" />
          </ListImageWrapper>
          <div className="grow">
            <div className="flex items-center text-left">
              <div className="flex flex-col overflow-hidden w-0 grow pr-5 gap-2">
                <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-950" />
                <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-950" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItemSkeleton;
