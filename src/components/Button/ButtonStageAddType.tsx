import { useDispatch } from "react-redux";
import { PlusIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DIALOG_EVENTS } from "@/store/constants";

import Button from ".";

const ButtonStageAddType = ({ index, type }: { index: number; type: string }) => {
  const dispatch = useDispatch();

  return (
    <Button type="ghost" onClick={() => dispatch({ type: DIALOG_EVENTS.DIALOG_DSP_STAGE_ADD_TYPE, payload: { index, type } })}>
      <PlusIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" /> Add {type}
    </Button>
  );
};

export default ButtonStageAddType;
