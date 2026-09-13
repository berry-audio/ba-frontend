import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePlaybackService } from "@/services/playback";
import { usePlayerActions } from "@/hooks/usePlayerActions";
import { PLAYBACK_STATE } from "@/constants/states";
import { PLAYER_EVENTS } from "@/store/constants";

import VolumeSlider from "./VolumeSlider";
import PositionSlider from "./PositionSlider";
import RepeatButton from "./RepeatButton";
import ShuffleButton from "./ShuffleButton";
import NextButton from "./NextButton";
import PreviousButton from "./PreviousButton";
import PlayPauseButton from "./PlayPauseButton";
import ButtonQueue from "../Button/ButtonQueue";
import ButtonWebRtc from "../Button/ButtonWebRtc";
import MetaDisplay from "./MetaDisplay";

const Player = () => {
  const dispatch = useDispatch();

  const { getCurrentTrackPos } = usePlaybackService();
  const { openNowPlayingOverlay } = usePlayerActions();

  const { playback_state } = useSelector((state: any) => state.player);

  const fetch_pos = async () => {
    const elapsed_ms = await getCurrentTrackPos();
    dispatch({
      type: PLAYER_EVENTS.POSITION_UPDATED,
      payload: elapsed_ms,
    });
  };

  useEffect(() => {
    let sync_pos: ReturnType<typeof setInterval> | null = null;
    if (playback_state === PLAYBACK_STATE.PLAYING) {
      fetch_pos();
      sync_pos = setInterval(() => fetch_pos(), 10000);
    }
    return () => {
      if (sync_pos) clearInterval(sync_pos);
    };
  }, [playback_state]);

  return (
    <>
      <div>
        <PositionSlider rounded={false} />
      </div>
      <div className="relative z-0">
        <div className="lg:flex hidden px-4 py-2 items-center ">
          <div className="w-3/8">
            <MetaDisplay size="md" onClick={openNowPlayingOverlay} />
          </div>

          <div className="w-2/8 flex items-center justify-center">
            <ShuffleButton />
            <PreviousButton />
            <PlayPauseButton />
            <NextButton />
            <RepeatButton />
          </div>

          <div className="w-3/8 text-right">
            <div className="flex justify-end text-right items-center">
              <div className="mr-5">
                <ButtonWebRtc />
              </div>
              <div className="flex items-center gap-3 w-50 max-w-xs mr-5">
                <VolumeSlider />
              </div>
              <div className="flex items-center">
                <div className="mr-2"></div>
                <ButtonQueue />
              </div>
            </div>
          </div>
        </div>

        {/* Mini Player  */}
        <div className="lg:hidden flex items-center justify-between relative bg-neutral-900 ">
          <MetaDisplay size="sm" onClick={openNowPlayingOverlay} />

          <div className="flex items-center w-2/6 justify-end z-20 relative">
            <div className="mr-2">
              <ButtonWebRtc className="text-white" />
            </div>
            <PlayPauseButton className="text-white" />
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Player);
