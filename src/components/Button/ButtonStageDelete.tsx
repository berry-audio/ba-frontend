import { useDispatch } from "react-redux";
import { TrashIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DIALOG_EVENTS } from "@/store/constants";

import ButtonIcon from "./ButtonIcon";

const ButtonStageDelete = ({ index, type }: { index: number; type: string }) => {
  const dispatch = useDispatch();

  return (
    <ButtonIcon onClick={() => dispatch({ type: DIALOG_EVENTS.DIALOG_DSP_STAGE_DELETE, payload: { index, type } })}>
      <TrashIcon weight={ICON_WEIGHT} size={ICON_SM} />
    </ButtonIcon>
  );
};

export default ButtonStageDelete;
