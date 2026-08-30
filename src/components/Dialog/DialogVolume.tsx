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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMixerVolume(volume);
  }, [volume]);

  useEffect(() => {
    // mount in hidden state, then flip to visible next frame so the transition plays
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const closeDialog = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
    }, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-1000 flex items-center justify-center backdrop-blur-md bg-overlay transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDialog();
      }}
    >
      <div
        className={`bg-dialog rounded-2xl shadow-2xl w-130 mx-4 overflow-hidden z-250 py-8 relative px-5 transition-all duration-200 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex items-center">
          <VolumeSlider onValueChange={(value) => setMixerVolume(value)} height={5} />
          <div className="ml-4 text-xl w-12">{mixerVolume}</div>
          <ButtonIcon className="shrink-0" onClick={closeDialog}>
            ✕
          </ButtonIcon>
        </div>
      </div>
    </div>
  );
};

export default DialogVolume;
