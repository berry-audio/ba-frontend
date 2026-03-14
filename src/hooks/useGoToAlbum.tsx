import { OVERLAY_EVENTS } from "@/store/constants";
import { Item } from "@/types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useGoToAlbum() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoToAlbum = (item: Item) => {
    if (!item?.albums?.length) return;
    const [view, id] = item?.albums[0].uri.split(":");
    dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE });
    navigate(`/local/${view}/${id}`);
  };

  return { handleGoToAlbum };
}
