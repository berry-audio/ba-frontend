import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { DIALOG_EVENTS } from "@/store/constants";

import VolumeSlider from "../Player/VolumeSlider";
import ButtonIcon from "../Button/ButtonIcon";

const DialogVolume = () => {
  const dispatch = useDispatch();

  const { volume } = useSelector((state: RootState) => state.player);

  const [mixerVolume, setMixerVolume] = useState<number | undefined>(undefined);

  useEffect(() => {
    setMixerVolume(volume);
  }, [volume]);

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center  backdrop-blur-md bg-overlay ">
      <div className={`bg-dialog rounded-2xl shadow-2xl w-130 mx-4 animate-fadeIn overflow-hidden z-250 py-8 relative px-5`}>
        <div className="flex items-center">
          <VolumeSlider onValueChange={(value) => setMixerVolume(value)} />
          <div className="ml-4 text-xl w-12">{mixerVolume}</div>
          <ButtonIcon className="shrink-0" onClick={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}>
            ✕
          </ButtonIcon>
        </div>
      </div>
    </div>
  );
};

export default DialogVolume;
