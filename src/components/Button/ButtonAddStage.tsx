import { useDispatch } from "react-redux";
import { PlusIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DIALOG_EVENTS } from "@/store/constants";

import Button from ".";

const ButtonAddStage = () => {
  const dispatch = useDispatch();

  return (
    <Button type="ghost" onClick={() => dispatch({ type: DIALOG_EVENTS.DIALOG_DSP_FILTER_ADD })}>
      <PlusIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" /> Add Stage
    </Button>
  );
};

export default ButtonAddStage;
