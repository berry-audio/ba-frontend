import { useNavigate } from "react-router-dom";
import { FadersIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ButtonIcon from "@/components/Button/ButtonIcon";

/**
 * Button component that navigates the user to the playlist page.
 *
 * @returns {JSX.Element} The rendered playlist navigation button.
 */
const ButtonDsp = () => {
  const navigate = useNavigate();

  const onClickHandler = () => {
    navigate("/dsp/dashboard");
  };

  return (
    <ButtonIcon onClick={onClickHandler} tooltip="DSP">
      <FadersIcon weight={ICON_WEIGHT} size={ICON_SM} />
    </ButtonIcon>
  );
};

export default ButtonDsp;
