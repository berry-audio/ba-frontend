import { useDispatch, useSelector } from "react-redux";
import { SpeakerSimpleHighIcon } from "@phosphor-icons/react";
import { calculateChannels } from "@/util";
import { STAGE_TYPE } from "@/views/Dsp/types";
import { ICON_WEIGHT, ICON_XS } from "@/constants";
import { DIALOG_EVENTS } from "@/store/constants";

import Button from ".";

const ButtonStageChannels = ({ index, channels, type }: { index: number; channels: number[] | null; type: STAGE_TYPE }) => {
  const dispatch = useDispatch();

  const { config } = useSelector((state: any) => state.dsp);

  const channelsCount = calculateChannels(config, index);

  return (
    <div>
      {(type === STAGE_TYPE.FILTER || type === STAGE_TYPE.PROCESSOR) && (
        <Button
          type="ghost"
          size="md"
          onClick={() => dispatch({ type: DIALOG_EVENTS.DIALOG_DSP_STAGE_CHANNELS, payload: { index, channels, channelsCount } })}
        >
          <SpeakerSimpleHighIcon weight={ICON_WEIGHT} size={ICON_XS} className="mr-2" />
          {channels === null ? "All" : `${channels && channels.length}/${channelsCount}`} <span className="hidden md:block">&nbsp;Channels</span>
        </Button>
      )}
    </div>
  );
};

export default ButtonStageChannels;
