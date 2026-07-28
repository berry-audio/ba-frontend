import { ReactElement, useState } from "react";
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
import { ICON_MD, ICON_WEIGHT } from "@/constants";

import "../../../node_modules/swiper/swiper.css";
import "../../../node_modules/swiper/modules/free-mode.css";
import "../../../node_modules/swiper/modules/pagination.css";

import ButtonStandby from "@/components/Button/ButtonStandby";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import Page from "@/components/Page";
import Spinner from "@/components/Spinner";
import Collection from "@/components/Collection";
import { REF } from "@/constants/refs";

type SourceItem = {
  name: string;
  icon: ReactElement;
  path: string;
  url?: string;
  disabled?: boolean;
  render?: boolean;
  type?: string;
};

const Start = () => {
  const navigate = useNavigate();

  const { setSource } = useSourceService();
  const { source } = useSelector((state: any) => state.player);
  const { config } = useSelector((state: any) => state.config);

  const [loadingItem, setLoadingItem] = useState<string | undefined>(undefined);

  const sources: SourceItem[] = [
    {
      name: "Playlists",
      icon: <PlaylistIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "playlist",
    },
    {
      name: "Collection",
      icon: <StackIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "collection",
    },

    {
      name: "Storage",
      icon: <FolderIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "storage",
    },
    {
      name: "Library",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "local",
    },
    {
      name: "Radio",
      icon: <GlobeHemisphereWestIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "radio",
    },
    {
      name: "FM Tuner",
      icon: <RadioIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "tuner",
    },
    {
      name: "USB DAC",
      icon: <WaveSineIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "usbdac",
      disabled: config.system.hardware !== "PI_ZERO_2W",
    },
    {
      name: "Line In",
      icon: <RadioButtonIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "linein",
    },
    {
      name: "Bluetooth",
      icon: <BluetoothIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "bluetooth",
    },
    {
      name: "Spotify",
      icon: <SpotifyLogoIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "spotify",
    },
    {
      name: "Airplay",
      icon: <AirplayIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "shairportsync",
    },
    {
      name: "Multiroom",
      icon: <SpeakerHifiIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "multiroom",
    },
    {
      name: "DSP",
      icon: <FadersIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "dsp",
    },
    {
      name: "Settings",
      icon: <GearIcon weight={ICON_WEIGHT} size={ICON_MD} />,
      path: "settings",
    },
  ];
  const onClickHandler = async (item: SourceItem) => {
    setLoadingItem(item.path);
    if (["spotify", "shairportsync", "linein", "usbdac", "tuner"].includes(item.path)) {
      const response = await setSource(item.path);
      if (!response) {
        setLoadingItem(undefined);
        return;
      }
    }
    navigate(`/${item.path}`);
    setLoadingItem(undefined);
  };

  return (
    <Page
      title=""
      rightComponent={
        <div className="flex h-12.5 items-center mr-4">
          <ButtonStandby />
        </div>
      }
    >
      <LayoutHeightWrapper>
        <div className="px-4 flex items-center">
          <div className="w-full">
            <h1 className="text-left text-2xl mb-2">Source</h1>
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
              {sources.map((item) => (
                <SwiperSlide>
                  <button
                    key={item.path}
                    disabled={item.disabled}
                    onClick={() => onClickHandler(item)}
                    className={`touch-pan-x rounded-lg flex items-center justify-center aspect-square overflow-hidden w-full transition-all duration-200 text-base
                cursor-pointer ${item.disabled ? "opacity-30" : source.uri === item.path ? "bg-primary hover:bg-foreground dark:hover:text-black" : "hover:bg-hover"}`}
                  >
                    {loadingItem === item.path && (
                      <div className="absolute bg-foreground/30 w-full h-full rounded-lg">
                        <Spinner mode="light" />
                      </div>
                    )}

                    <div className="flex flex-col items-center">
                      <div className="mb-2">{item.icon}</div>
                      <div className="flex">{item.name}</div>
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="m-5">
          <Collection type={REF.RECENT} limit={10} />
        </div>
        <div className="m-5">
          <Collection type={REF.TOP100} limit={10} />
        </div>
        <div className="m-5 mb-7">
          <Collection type={REF.FAVOURITE} limit={10} />
        </div>
      </LayoutHeightWrapper>
    </Page>
  );
};

export default Start;
