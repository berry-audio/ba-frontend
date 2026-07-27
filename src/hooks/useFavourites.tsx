import { useState } from "react";
import { AnyItem } from "@/types";
import { MODEL } from "@/constants/refs";
import { useCollectionService } from "@/services/collection";

export function useFavourites() {
  const { addFavourite } = useCollectionService();
  const [loading, setLoading] = useState<boolean>(false);

  const toggleFavourite = async (item: AnyItem) => {
    setLoading(true);
    try {
      let itemResult;
      switch (item.__model__) {
        case MODEL.ARTIST:
        case MODEL.ALBUM:
        case MODEL.TRACK:
        case MODEL.FILE:
          itemResult = item;
          break;
        case MODEL.TLTRACK:
          itemResult = item.track;
          break;
      }

      if (!itemResult) {
        return false;
      }

      const favourite = await addFavourite(itemResult);
      return favourite;
    } finally {
      setLoading(false);
    }
  };

  return { toggleFavourite, loading };
}
