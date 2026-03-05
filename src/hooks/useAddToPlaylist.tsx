import { useDispatch } from "react-redux";
import { Item } from "@/types";
import { DIALOG_EVENTS } from "@/store/constants";

export function useAddToPlaylist() {
  const dispatch = useDispatch();

  const handleAddToPlaylist = (item: Item) => {
    dispatch({ type: DIALOG_EVENTS.DIALOG_PLAYLISTS, payload: item });
  };

  return { handleAddToPlaylist };
}
