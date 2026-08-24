import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChannelLabels, getLabelForChannel } from "@/util";
import { SpeakerSimpleLowIcon } from "@phosphor-icons/react/dist/ssr";
import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react";
import { ICON_SM } from "@/constants";
import { DIALOG_EVENTS } from "@/store/constants";

import Modal from "../Modal";
import useDspActions from "@/hooks/useDspActions";
import ItemWrapper from "../Wrapper/ItemWrapper";

const DialogStageChannels = ({
  item,
}: {
  item: {
    index: number;
    channels: number[] | null;
    channelsCount: number;
  };
}) => {
  const dispatch = useDispatch();
  const allChannels = Array.from({ length: item.channelsCount }, (_, index) => index);

  const [selectedChannels, setSelectedChannels] = useState<number[]>(item.channels ?? allChannels);

  const { config } = useSelector((state: any) => state.dsp);
  const { updateStageChannels } = useDspActions();

  const channelLabels = getChannelLabels(config, item.index);

  return (
    <Modal
      title="Channels"
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Apply"
      buttonLoading={false}
      buttonOnClick={() => updateStageChannels(item.index, selectedChannels, item.channelsCount)}
    >
      {allChannels.map((index) => (
        <div key={index} className="col-span-2 md:col-span-1">
          <ItemWrapper>
            <div className="flex flex-1">
              <div
                onClick={() => setSelectedChannels((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))}
                className="py-4 px-4 flex items-center flex-1"
              >
                <SpeakerSimpleLowIcon weight="fill" size={ICON_SM} className="mr-2" />
                {getLabelForChannel(channelLabels, index, true, false)}
              </div>
            </div>

            <div className="pr-4">
              {selectedChannels.includes(index) ? (
                <CheckCircleIcon weight="fill" size={ICON_SM} className="text-primary" />
              ) : (
                <CircleIcon size={25} className="opacity-50" />
              )}
            </div>
          </ItemWrapper>
        </div>
      ))}
    </Modal>
  );
};

export default DialogStageChannels;
