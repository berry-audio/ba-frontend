import { useSocketRequest } from "@/store/useSocketRequest";
import { AnyItem } from "@/types";

export const useCollectionService = () => {
  const { request } = useSocketRequest();

  return {
    getDirectory: (uri?: string, limit?: number, offset?: number) => request("collection.directory", { uri, limit, offset }),
    addFavourite:(item?: AnyItem) => request("collection.favourite", { item })
  };
};
