import { useDispatch, useSelector } from "react-redux";
import { allowStageChange } from "@/views/Dsp/components/Pipeline/Stage";
import { SpeakerSimpleHighIcon } from "@phosphor-icons/react";
import { calculateInChannels } from "@/util";
import { STAGE_TYPE } from "@/views/Dsp/types";
import { ICON_WEIGHT, ICON_XS } from "@/constants";
import { DIALOG_EVENTS } from "@/store/constants";

import Button from ".";

const ButtonStageChannels = ({ index }: { index: number }) => {
  const dispatch = useDispatch();

  const { config } = useSelector((state: any) => state.dsp);

  const stage = config.pipeline[index];
  const channelsCount = calculateInChannels(config, index);

  return (
    <div>
      {stage.type === STAGE_TYPE.FILTER && (
        <Button
          type="ghost"
          size="md"
          disabled={!allowStageChange(stage)}
          onClick={() => dispatch({ type: DIALOG_EVENTS.DIALOG_DSP_STAGE_CHANNELS, payload: { index, channels: stage.channels, channelsCount } })}
        >
          <SpeakerSimpleHighIcon weight={ICON_WEIGHT} size={ICON_XS} className="mr-2" />
          {stage.channels === null ? "All" : `${stage.channels && stage.channels.length}/${channelsCount}`}{" "}
          <span className="hidden md:block">&nbsp;Channels</span>
        </Button>
      )}
    </div>
  );
};

export default ButtonStageChannels;
