import { Item } from "@/types";
import { useNavigate } from "react-router-dom";

export function useGoToAlbum() {
  const navigate = useNavigate();

  const handleGoToAlbum = (item: Item) => {
    if (!item?.albums?.length) return;
    const [view, id] = item?.albums[0].uri.split(":");
    navigate(`/local/${view}/${id}`);
  };

  return { handleGoToAlbum };
}
