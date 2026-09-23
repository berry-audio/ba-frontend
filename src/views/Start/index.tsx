import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSourceService } from "@/services/source";
import {
  AirplayIcon,
  BluetoothIcon,
  FadersIcon,
  FolderIcon,
  GearIcon,
  GlobeHemisphereWestIcon,
  PlaylistIcon,
  RadioButtonIcon,
  RadioIcon,
  SpeakerHifiIcon,
  SpotifyLogoIcon,
  StackIcon,
  VinylRecordIcon,
  WaveSineIcon,
} from "@phosphor-icons/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Mousewheel, Pagination, Scrollbar } from "swiper/modules";
import { Source } from "@/types";
import { ICON_MD, ICON_WEIGHT } from "@/constants";
import { REF } from "@/constants/refs";

import "../../../node_modules/swiper/swiper.css";
import "../../../node_modules/swiper/modules/free-mode.css";
import "../../../node_modules/swiper/modules/pagination.css";

import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import Spinner from "@/components/Spinner";
import Collection from "@/components/Collection";

const Start = () => {
  const navigate = useNavigate();

  const { setSource } = useSourceService();
  const { directory } = useSelector((state: any) => state.source);

  const [loadingItem, setLoadingItem] = useState<string | undefined>(undefined);

  const SOURCE_ICONS: Record<string, React.ReactNode> = {
    playlist: <PlaylistIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    collection: <StackIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    storage: <FolderIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    local: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    radio: <GlobeHemisphereWestIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    tuner: <RadioIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    usbdac: <WaveSineIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    linein: <RadioButtonIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    bluetooth: <BluetoothIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    spotify: <SpotifyLogoIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    shairportsync: <AirplayIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    multiroom: <SpeakerHifiIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    dsp: <FadersIcon weight={ICON_WEIGHT} size={ICON_MD} />,
    config: <GearIcon weight={ICON_WEIGHT} size={ICON_MD} />,
  };

  const onClickHandler = async (item: Source) => {
    setLoadingItem(item.uri);

    if (!item.browsable) {
      const response = await setSource(item.uri);
      if (!response) {
        setLoadingItem(undefined);
        return;
      }
    }

    navigate(`/${item.uri}`);
    setLoadingItem(undefined);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="flex justify-center pt-3">
        <div className={`lg:max-w-200 w-full`}>
          <LayoutHeightWrapper className="h-[calc(100dvh-145px)]! lg:h-[calc(100dvh-160px)]! ">
            <div className="px-5 py-2 pr-0 flex items-center">
              <div className="w-full">
                <h1 className="text-left font-bold text-xl lg:text-2xl mb-2">Source</h1>
                <Swiper
                  modules={[FreeMode, Keyboard, Mousewheel, Pagination, Scrollbar]}
                  spaceBetween={5}
                  slidesPerView={3.5}
                  freeMode={true}
                  resistance={false}
                  touchReleaseOnEdges={true}
                  grabCursor={true}
                  direction={"horizontal"}
                  mousewheel={true}
                  pagination={{
                    el: ".custom-pagination",
                    clickable: true,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 5.5,
                    },
                    768: {
                      slidesPerView: 6.5,
                    },
                    1024: {
                      slidesPerView: 6.5,
                    },
                    1280: {
                      slidesPerView: 6.5,
                    },
                  }}
                  keyboard={{
                    enabled: true,
                  }}
                >
                  {directory.map((item: Source) => (
                    <SwiperSlide>
                      <button
                        key={item.uri}
                        disabled={!item.enabled}
                        onClick={() => onClickHandler(item)}
                        className={`touch-pan-x rounded-lg flex items-center justify-center aspect-square overflow-hidden w-full transition-all duration-200 text-base
                cursor-pointer ${!item.enabled ? "opacity-30" : item.active ? "bg-primary hover:bg-foreground dark:hover:text-black" : "hover:bg-hover"}`}
                      >
                        {loadingItem === item.uri && (
                          <div className="absolute bg-foreground/30 w-full h-full rounded-lg">
                            <Spinner mode="light" />
                          </div>
                        )}

                        <div className="flex flex-col items-center">
                          <div className="mb-2">{SOURCE_ICONS[item.uri]}</div>
                          <div className="flex">{item.name}</div>
                        </div>
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            <div className="px-5 py-2 pr-0">
              <Collection type={REF.RECENT} limit={10} />
            </div>
            <div className="px-5 py-2 pr-0">
              <Collection type={REF.TOP100} limit={10} />
            </div>
            <div className="px-5 py-2 pr-0">
              <Collection type={REF.FAVOURITE} limit={10} />
            </div>
          </LayoutHeightWrapper>
        </div>
      </div>
    </div>
  );
};

export default Start;
