import { useSelector } from "react-redux";

import Overlay from ".";
import DateTime from "../DateTime";
import ButtonWake from "../Button/ButtonWake";
import { useSystemService } from "@/services/system";
import { useTheme } from "@/contexts/ThemeProvider";

const OverlayStandby = () => {
  const { theme } = useTheme();
  const { setStandby } = useSystemService();

  const { power_state } = useSelector((state: any) => state.system);

  return (
    <Overlay zindex={100} show={power_state === "standby"} overlay onClick={async () => await setStandby()}>
      <div className="top-5 right-5 absolute" onClick={async () => await setStandby()}>
        <ButtonWake />
      </div>
      <div className="flex flex-col justify-center items-center">
        {theme === "dark" ? (
          <img src="/assets/berryaudio_logo_light.png" className="w-auto max-w-25" />
        ) : (
          <img src="/assets/berryaudio_logo_dark.png" className="w-auto max-w-25" />
        )}
        <div className="items-center justify-center flex w-full h-full text-[50px] lg:text-[70px] font-black relative z-40">
          <DateTime time />
        </div>
        <div className="items-center justify-center flex w-full h-full text-[21px] lg:text-[30px] -mt-3 relative z-40">
          <DateTime weekday />
        </div>
      </div>

      <div className="glow-outer absolute left-1/2 bottom-0 w-[3000px] aspect-square -translate-x-1/2 translate-y-[75%] z-0 blur-[2px]"></div>
      <div className="glow-core absolute left-1/2 bottom-0 w-[1000px] aspect-square -translate-x-1/2 translate-y-[75%] z-0 opacity-90 mix-blend-screen"></div>
    </Overlay>
  );
};

export default OverlayStandby;
