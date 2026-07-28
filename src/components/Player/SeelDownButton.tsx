import { useTunerService } from "@/services/tuner";
import { CaretLeftIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ButtonIcon from "../Button/ButtonIcon";

const SeekDownButton = () => {
  const { seekDown } = useTunerService();

  const onClickSeekDown = async () => {
    await seekDown();
  };

  return (
    <ButtonIcon className="md:mr-20" onClick={onClickSeekDown}>
      <CaretLeftIcon size={ICON_SM} weight={ICON_WEIGHT} />
    </ButtonIcon>
  );
};

export default SeekDownButton;
