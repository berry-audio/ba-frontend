import { useDispatch } from "react-redux";
import { RowsPlusTopIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DIALOG_EVENTS } from "@/store/constants";

import ButtonIcon from "@/components/Button/ButtonIcon";

const ButtonAddSmb = () => {
  const dispatch = useDispatch();

  return (
    <ButtonIcon onClick={() => dispatch({ type: DIALOG_EVENTS.DIALOG_ADD_SMB })}>
      <RowsPlusTopIcon weight={ICON_WEIGHT} size={ICON_SM} />
    </ButtonIcon>
  );
};

export default ButtonAddSmb;
