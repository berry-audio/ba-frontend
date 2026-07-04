import { useDispatch } from "react-redux";
import { AnyItem, Track } from "@/types";
import { DRAWER_EVENTS, OVERLAY_EVENTS } from "@/store/constants";

export function useGoToAlbum() {
  const dispatch = useDispatch();

  const handleGoToAlbum = (item: AnyItem) => {
    if (!(item as Track)?.albums?.length) return;
    const [view, id] = (item as Track)?.albums[0].uri.split(":");
    dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE });
    dispatch({
          type: DRAWER_EVENTS.DRAWER_LOCAL,
          payload: { view, id },
        });
  };

  return { handleGoToAlbum };
}
