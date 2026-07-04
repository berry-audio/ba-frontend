import { AnyItem, Track } from "@/types";
import { useDispatch } from "react-redux";
import { DRAWER_EVENTS, OVERLAY_EVENTS } from "@/store/constants";

export function useGoToArtist() {
  const dispatch = useDispatch();

  const handleGoToArtist = (item: AnyItem) => {
    if (!(item as Track)?.artists?.length) return;
    const [view, id] = (item as Track)?.artists[0].uri.split(":");
    dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE });
    dispatch({
      type: DRAWER_EVENTS.DRAWER_LOCAL,
      payload: { view, id },
    });
  };

  return { handleGoToArtist };
}
