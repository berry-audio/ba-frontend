import { useWebRtc } from "@/hooks/useWebRtc";
import { MonitorPlayIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ButtonIcon from "./ButtonIcon";
import Spinner from "../Spinner";

const ButtonWebRtc = ({ className }: { className?: string }) => {
  const { toggleStream, status, audioRef } = useWebRtc();

  return (
    <>
      <ButtonIcon
        onClick={toggleStream}
        disabled={status === "connecting"}
        className={`${status === "connected" && "text-primary"} ${className ?? ""}`}
      >
        {status === "connecting" ? <Spinner /> : <MonitorPlayIcon weight={ICON_WEIGHT} size={ICON_SM} />}
      </ButtonIcon>
      <audio ref={audioRef} controls playsInline className="hide" />
    </>
  );
};

export default ButtonWebRtc;
