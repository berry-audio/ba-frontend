import { useDspActions } from "@/hooks/useDspActions";
import { PlusIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import Button from ".";

const ButtonStageAdd = () => {
  const { addStage } = useDspActions();

  return (
    <Button type="ghost" onClick={() => addStage(7)}>
      <PlusIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" /> Add Stage
    </Button>
  );
};

export default ButtonStageAdd;
