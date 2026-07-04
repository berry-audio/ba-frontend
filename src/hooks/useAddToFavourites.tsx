import { useState } from "react";
import { AnyItem } from "@/types";
import { useDispatch } from "react-redux";
import { INTERNAL_EVENTS } from "@/store/constants";

export function useAddToFavourites() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const addToFavourites = async (item: AnyItem) => {
    setLoading(true);
    console.log("Adding to favourites:", item);
    dispatch({
      type: INTERNAL_EVENTS.ADD_TO_FAVOURITE,
      payload: item,
    });
    setLoading(false);
  };

  return { addToFavourites, loading };
}
