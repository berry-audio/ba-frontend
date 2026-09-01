import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HouseIcon } from "@phosphor-icons/react";
import { OVERLAY_EVENTS, DIALOG_EVENTS } from "@/store/constants";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import DateTime from "../DateTime";
import ButtonIcon from "../Button/ButtonIcon";
import ButtonSearch from "../Button/ButtonSearch";
import ButtonVolume from "../Player/ButtonVolume";
import BluetoothStatus from "../Bluetooth/BluetoothStatus";
import SourceStatus from "../Source/SourceStatus";
import ButtonStandby from "../Button/ButtonStandby";

export function Menu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClickMenuHandler = () => {
    dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE });
    dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
    navigate("/");
  };

  return (
    <div className="px-3 h-15 flex justify-between items-center relative">
      <div className="flex items-center ">
        <ButtonIcon onClick={onClickMenuHandler}>
          <HouseIcon size={ICON_SM} weight={ICON_WEIGHT} />
        </ButtonIcon>
        <span className="pr-4 pl-2">
          <DateTime time />
        </span>
      </div>

      <div className="flex items-center">
        <BluetoothStatus />
        <SourceStatus />
        <ButtonSearch />
        <ButtonVolume />
        <ButtonStandby />
      </div>
    </div>
  );
}
