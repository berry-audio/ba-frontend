import { QueueIcon } from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { DRAWER_EVENTS, OVERLAY_EVENTS } from "@/store/constants";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ButtonIcon from "@/components/Button/ButtonIcon";

/**
 * Button component that navigates the user to the playlist page.
 *
 * @returns {JSX.Element} The rendered playlist navigation button.
 */
const ButtonQueue = () => {
  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE });
    dispatch({ type: DRAWER_EVENTS.DRAWER_TRACKLIST });
  };

  return (
    <ButtonIcon onClick={onClickHandler}>
      <QueueIcon weight={ICON_WEIGHT} size={ICON_SM} />
    </ButtonIcon>
  );
};

export default ButtonQueue;
