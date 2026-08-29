import { useDispatch } from "react-redux";
import { useState } from "react";
import { useDspService } from "@/services/dsp";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { INTERNAL_EVENTS } from "@/store/constants";
import { EVENTS } from "@/constants/events";

import ButtonIcon from "@/components/Button/ButtonIcon";
import Spinner from "@/components/Spinner";

const ButtonDspRefresh = () => {
  const dispatch = useDispatch();
  const { getDspConfig } = useDspService();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleScan = async () => {
    setIsLoading(true);
    const config = await getDspConfig();
    dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config } });
    dispatch({ type: INTERNAL_EVENTS.DSP_UPDATED });
    setIsLoading(false);
  };

  return (
    <ButtonIcon onClick={handleScan} className="mr-1" tooltip="Fetch Config">
      {isLoading ? <Spinner /> : <ArrowsClockwiseIcon weight={ICON_WEIGHT} size={ICON_SM} />}
    </ButtonIcon>
  );
};

export default ButtonDspRefresh;
