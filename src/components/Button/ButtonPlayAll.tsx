import { PlayIcon } from "@phosphor-icons/react";
import { usePlayNow } from "@/hooks/usePlayNow";
import { Item } from "@/types";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ButtonIcon from "@/components/Button/ButtonIcon";
import Spinner from "@/components/Spinner";

const ButtonPlayAll = ({ item }: { item: Item }) => {
  const { handlePlayNow, loading } = usePlayNow();

  return <ButtonIcon onClick={() => handlePlayNow(item)}>{loading ? <Spinner /> : <PlayIcon weight={ICON_WEIGHT} size={ICON_SM} />}</ButtonIcon>;
};

export default ButtonPlayAll;
