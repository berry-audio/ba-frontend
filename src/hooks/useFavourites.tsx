import { useState } from "react";
import { AnyItem } from "@/types";
import { useDispatch } from "react-redux";
import { INTERNAL_EVENTS } from "@/store/constants";
import { MODEL } from "@/constants/refs";
import { useCollectionService } from "@/services/collection";

export function useFavourites() {
  const dispatch = useDispatch();

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
      dispatch({
        type: favourite ? INTERNAL_EVENTS.FAVOURITE_ADDED : INTERNAL_EVENTS.FAVOURITE_REMOVE,
        payload:item
      });

      return favourite;
    } finally {
      setLoading(false);
    }
  };

  const isFavourite = (item: AnyItem) => {
    switch (item.__model__) {
      case MODEL.ARTIST:
      case MODEL.ALBUM:
      case MODEL.TRACK:
        return item.favourite;
      case MODEL.TLTRACK:
        return item.track.favourite;
      default:
        return false;
    }
  };

  const mergeFavourite = (item: AnyItem, favourite:boolean) => {
    switch (item.__model__) {
      case MODEL.ARTIST:
      case MODEL.ALBUM:
      case MODEL.TRACK:
        return {...item, favourite };
      case MODEL.TLTRACK:
        return {...item, track: {...item.track, favourite } };
      default:
        return {...item };
    }
  };

  return { toggleFavourite, isFavourite, mergeFavourite, loading };
}
