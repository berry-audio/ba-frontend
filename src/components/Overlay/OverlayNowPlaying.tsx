import { useCallback, useEffect, useState } from "react";
import { CaretDownIcon, UserIcon, VinylRecordIcon } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { useTunerService } from "@/services/tuner";
import { getAlbums, getArtists, getImage } from "@/util";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { PLAYBACK_STATE } from "@/constants/states";
import { OVERLAY_EVENTS } from "@/store/constants";
import { EVENTS } from "@/constants/events";
import { Menu } from "../Menu";
import type { RootState } from "@/store";

import PositionSlider from "../Player/PositionSlider";
import RepeatButton from "../Player/RepeatButton";
import ScrollingText from "../ScrollingText";
import NextButton from "../Player/NextButton";
import PreviousButton from "../Player/PreviousButton";
import PlayPauseButton from "../Player/PlayPauseButton";
import Page from "../Page";
import Source from "../Source/SourceDevice";
import FavouriteButton from "../Player/FavouriteButton";
import Overlay from ".";
import ShuffleButton from "../Player/ShuffleButton";
import ButtonIcon from "@/components/Button/ButtonIcon";
import ButtonQueue from "../Button/ButtonQueue";
import Ruler from "../ui/ruler";
import StreamInfo from "../Player/StreamInfo";
import CoverArt from "../CoverArt";
import ButtonAddPreset from "../Button/ButtonAddPreset";
import SeekUpButton from "../Player/SeekUpButton";
import SeekDownButton from "../Player/SeelDownButton";

const RENDERER_SOURCES = new Set(["bluetooth", "spotify", "shairportsync", "usbdac", "multiroom"]);
const DEFAULT_BG = "#202020";
const SHORT_SCREEN_QUERY = "(max-height: 600px)";
const SM_SCREEN_QUERY = "(min-width: 640px)";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => (typeof window === "undefined" ? false : window.matchMedia(query).matches));

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

function useThemeColor(color: string | null) {
  useEffect(() => {
    if (!color) return;

    const root = document.documentElement;
    const body = document.body;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

    const prevMeta = meta?.content;
    const prevBodyBg = body.style.backgroundColor;

    root.style.setProperty("--player-bg", color);
    body.style.backgroundColor = color;
    if (meta) meta.content = color;

    return () => {
      root.style.removeProperty("--player-bg");
      body.style.backgroundColor = prevBodyBg;
      if (meta && prevMeta !== undefined) meta.content = prevMeta;
    };
  }, [color]);
}

type DiscProps = {
  track: any;
  playing: boolean;
  shiftClass: string;
};

const Disc = ({ track, playing, shiftClass }: DiscProps) => (
  <>
    <img
      src="/assets/disc.png"
      alt=""
      className={`animate-spin transition-transform duration-500 ease-in-out ${playing ? shiftClass : "translate-x-0 [paused]"}`}
    />
    <div className="shadow-[1px_14px_21px_-6px_rgba(0,0,0,0.2)] absolute top-0 rounded-lg overflow-hidden h-full aspect-square">
      <CoverArt item={track} loadingPlay={!track} disable />
    </div>
  </>
);

const OverlayNowPlaying = () => {
  const dispatch = useDispatch();
  const { setChannel } = useTunerService();

  const overlay = useSelector((s: RootState) => (s as any).overlay.overlay);
  const source = useSelector((s: RootState) => (s as any).source.source);
  const showAlbumArtBg = useSelector((s: RootState) => (s as any).config.config.playback.background_albumart);
  const channel = useSelector((s: RootState) => (s as any).tuner.channel);
  const current_track = useSelector((s: RootState) => (s as any).player.current_track);
  const playback_state = useSelector((s: RootState) => (s as any).player.playback_state);

  const track = current_track?.track;
  const isActive = overlay === OVERLAY_EVENTS.OVERLAY_NOWPLAYING;
  const isShort = useMediaQuery(SHORT_SCREEN_QUERY);
  const isSm = useMediaQuery(SM_SCREEN_QUERY);

  useThemeColor(isActive ? track?.bg_color || DEFAULT_BG : null);

  const onChange = useCallback(
    (value: number) =>
      dispatch({
        type: EVENTS.TRACK_META_UPDATED,
        payload: { tl_track: { track: { ...track, name: `FM ${(value / 10).toFixed(2)} Mhz` } } },
      }),
    [dispatch, track],
  );

  const onRelease = useCallback((value: number) => setChannel(value), [setChannel]);

  if (!source) return null;

  const isTuner = source.uri === "tuner";
  const isRenderer = RENDERER_SOURCES.has(source.uri);
  const playing = playback_state === PLAYBACK_STATE.PLAYING;
  const hasArtist = !!track?.artists?.length;
  const hasAlbum = !!track?.albums?.length;
  const subtitle = hasArtist ? `${getArtists(track.artists)}${track.album?.name ? ` · ${track.album.name}` : ""}` : null;

  return (
    <Overlay show={isActive} full zindex={50}>
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={isActive ? { backgroundColor: track?.bg_color } : undefined}>
        {showAlbumArtBg && isActive && <div className="h-full bg-cover blur-3xl" style={{ backgroundImage: `url(${getImage(current_track)})` }} />}
      </div>

      <Menu />
      <Page>
        <ButtonIcon
          className="hover:bg-black z-51 absolute top-12 right-4"
          aria-label="Collapse player"
          onClick={() => dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE })}
        >
          <CaretDownIcon weight={ICON_WEIGHT} size={ICON_SM} />
        </ButtonIcon>

        {!isShort && (
          <div className="-mt-7.5 px-6 relative z-50">
            <div className="flex items-center justify-center overflow-hidden relative pb-6">
              <div
                className={`left-2 aspect-square h-65 w-65 md:h-87.5 md:w-87.5 h-600-img h-800-400-img lg:mr-10 relative transition-all duration-500 ease-in-out transform ${
                  playing ? "mr-10" : "mr-5"
                }`}
              >
                <Disc track={track} playing={playing} shiftClass="translate-x-15" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {isTuner && <SeekDownButton />}

              <div className="w-full">
                <div className="flex items-center justify-center">
                  <h2 className="lg:text-4xl lg:mb-1 text-3xl font-semibold max-w-[90%]">
                    {track?.name ? <ScrollingText text={track.name} /> : source.name}
                  </h2>

                  {isTuner && (
                    <div className="ml-2">
                      <ButtonAddPreset />
                    </div>
                  )}
                </div>

                {subtitle && (
                  <div className="flex items-center justify-center mt-1">
                    <div className="max-w-80">
                      <ScrollingText text={subtitle} />
                    </div>
                  </div>
                )}
              </div>

              {isTuner && <SeekUpButton />}
            </div>

            {isTuner && (
              <div className="flex items-center justify-center mt-1">
                <div className="max-w-80 opacity-50">
                  <StreamInfo channels={true} />
                </div>
              </div>
            )}

            <div className="flex items-center justify-center mt-2 w-full h-20">
              <div className="mt-6 max-w-800 w-100">
                {isTuner ? (
                  <div className="-mb-7 -mt-9">
                    <Ruler position={channel} onChange={onChange} onRelease={onRelease} />
                  </div>
                ) : (
                  <PositionSlider className="rounded-full" showElapsedNumber={true} />
                )}
              </div>
            </div>

            <div className="flex items-center justify-center mt-6 mb-9 w-full">
              <div className="max-w-300 w-100 flex justify-between items-center">
                <FavouriteButton />
                <div className="flex items-center">
                  <ShuffleButton />
                  <PreviousButton />
                  <PlayPauseButton />
                  <NextButton />
                  <RepeatButton />
                </div>
                <ButtonQueue />
              </div>
            </div>
          </div>
        )}

        {isShort && (
          <div className="-mt-8.25 px-5 relative z-50">
            <div className="flex items-center justify-center">
              <div
                className={`w-1/12 aspect-square md:w-87.5 h-600-img lg:mr-10 relative transition-all duration-500 ease-in-out transform ${
                  playing ? "mr-10" : "mr-5"
                }`}
              >
                <Disc track={track} playing={playing} shiftClass="translate-x-7" />
              </div>

              <div className="w-11/12 overflow-hidden">
                <div className="flex items-center">
                  <h2 className="lg:text-4xl lg:mb-1 text-2xl sm:text-3xl font-semibold">
                    {track?.name ? <ScrollingText text={track.name} /> : source.name}
                  </h2>

                  {isTuner && (
                    <div className="flex items-center ml-5 -mb-1">
                      <ButtonAddPreset />
                      <SeekDownButton />
                      <SeekUpButton />
                    </div>
                  )}
                </div>

                {subtitle && (
                  <div className="mt-2 flex items-center">
                    <UserIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />
                    <ScrollingText text={subtitle} />
                  </div>
                )}

                {isTuner && (
                  <div className="flex items-center mt-2">
                    <StreamInfo channels={true} />
                  </div>
                )}

                <div className="mt-2">
                  {isRenderer ? (
                    <Source />
                  ) : hasAlbum ? (
                    <div className="flex items-center">
                      <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />
                      <ScrollingText text={`${getAlbums(track?.albums)}`} />
                    </div>
                  ) : null}
                </div>

                {isSm && (
                  <div className="flex items-center mt-4 w-full">
                    <div className="max-w-300 w-80 flex justify-between items-center">
                      <FavouriteButton />
                      <div className="flex items-center">
                        <ShuffleButton />
                        <PreviousButton />
                        <PlayPauseButton />
                        <NextButton />
                        <RepeatButton />
                      </div>
                      <ButtonQueue />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isTuner && <Ruler position={channel} onChange={onChange} onRelease={onRelease} />}

            <div className="items-center justify-center mt-2 w-full">
              {!isSm && (
                <div className="flex justify-between items-center">
                  <FavouriteButton />
                  <div className="flex items-center">
                    <ShuffleButton />
                    <PreviousButton />
                    <PlayPauseButton />
                    <NextButton />
                    <RepeatButton />
                  </div>
                  <ButtonQueue />
                </div>
              )}

              {!isTuner && (
                <div className="mt-6 md:max-w-800 w-full">
                  <PositionSlider className="rounded-full" showElapsedNumber={true} />
                </div>
              )}
            </div>
          </div>
        )}
      </Page>
    </Overlay>
  );
};

export default OverlayNowPlaying;
