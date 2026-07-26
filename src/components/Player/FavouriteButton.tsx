import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HeartIcon } from "@phosphor-icons/react";
import { useFavourites } from "@/hooks/useFavourites";
import { ICON_SM } from "@/constants";

import ButtonIcon from "@/components/Button/ButtonIcon";
import Spinner from "../Spinner";

const FavouriteButton = () => {
  const { current_track } = useSelector((state: any) => state.player);
  const { source } = useSelector((state: any) => state.player);
  const { toggleFavourite, loading: loadingFavourite } = useFavourites();

  const [favourited, setFavourited] = useState<boolean>(false);

  useEffect(() => {
    if (!current_track) return;
    setFavourited(current_track?.track.favourite);
  }, [current_track]);

  return (
    <ButtonIcon
      onClick={async (e) => {
        e.stopPropagation();
        const result = await toggleFavourite(current_track?.track);
        setFavourited(result);
      }}
      className={` ${favourited ? "text-primary " : "hover:text-primary"}`}
      disabled={!source?.controls?.includes("favourite")}
    >
      {loadingFavourite ? <Spinner mode="light" /> : <HeartIcon size={ICON_SM} weight={favourited ? "fill" : "regular"} />}
    </ButtonIcon>
  );
};

export default FavouriteButton;
