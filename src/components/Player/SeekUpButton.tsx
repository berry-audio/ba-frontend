import { useTunerService } from "@/services/tuner";
import ButtonIcon from "../Button/ButtonIcon";
import { CaretRightIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

const SeekUpButton = () => {
  const { seekUp } = useTunerService();

  const onClickSeekUp = async () => {
    await seekUp();
  };

  return (
    <ButtonIcon className="md:mr-20" onClick={onClickSeekUp}>
      <CaretRightIcon size={ICON_SM} weight={ICON_WEIGHT} />
    </ButtonIcon>
  );
};

export default SeekUpButton;
