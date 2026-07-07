import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSourceService } from "@/services/source";
import {
  AirplayIcon,
  BluetoothIcon,
  FadersIcon,
  GearIcon,
  GlobeHemisphereWestIcon,
  MemoryIcon,
  PlaylistIcon,
  RadioButtonIcon,
  RadioIcon,
  SpeakerHifiIcon,
  SpotifyLogoIcon,
  UsbIcon,
  VinylRecordIcon,
} from "@phosphor-icons/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Mousewheel, Pagination, Scrollbar } from "swiper/modules";
import { ICON_LG, ICON_WEIGHT } from "@/constants";

import "../../../node_modules/swiper/swiper.css";
import "../../../node_modules/swiper/modules/free-mode.css";
import "../../../node_modules/swiper/modules/pagination.css";

import ButtonStandby from "@/components/Button/ButtonStandby";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import Page from "@/components/Page";
import Spinner from "@/components/Spinner";

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
      icon: <PlaylistIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "playlist",
    },
    {
      name: "DSP",
      icon: <FadersIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "dsp",
    },
    {
      name: "Storage",
      icon: <UsbIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "storage",
    },
    {
      name: "Library",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "local/album",
    },
    {
      name: "Radio",
      icon: <GlobeHemisphereWestIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "radio",
    },
    {
      name: "FM Tuner",
      icon: <RadioIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "tuner",
    },
    {
      name: "USB DAC",
      icon: <MemoryIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "usbdac",
      disabled: config.system.hardware !== "PI_ZERO_2W",
    },
    {
      name: "Line In",
      icon: <RadioButtonIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "linein",
    },

    {
      name: "Bluetooth",
      icon: <BluetoothIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "bluetooth",
    },
    {
      name: "Spotify",
      icon: <SpotifyLogoIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "spotify",
    },
    {
      name: "Airplay",
      icon: <AirplayIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "shairportsync",
    },
    {
      name: "Multiroom",
      icon: <SpeakerHifiIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "multiroom",
    },
    {
      name: "Settings",
      icon: <GearIcon weight={ICON_WEIGHT} size={ICON_LG} />,
      path: "settings",
    },
  ];

  const onClickHandler = async (item: SourceItem) => {
    setLoadingItem(item.path);
    ["spotify", "shairportsync", "linein", "usbdac", "tuner"].includes(item.path) && (await setSource(item.path));
    navigate(`/${item.path}`);
    setLoadingItem(undefined);
  };

  return (
    <Page
      title="Source"
      rightComponent={
        <div className="flex h-12.5 items-center mr-4">
          <ButtonStandby />
        </div>
      }
    >
      <LayoutHeightWrapper>
        <div className="px-4 flex items-center">
          <div className="w-full">
            <Swiper
              modules={[FreeMode, Keyboard, Mousewheel, Pagination, Scrollbar]}
              spaceBetween={10}
              slidesPerView={4}
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
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 6,
                },
                1024: {
                  slidesPerView: 6,
                },
                1280: {
                  slidesPerView: 6,
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
                    className={`hover:bg-hover touch-pan-x rounded-lg flex items-center justify-center aspect-square overflow-hidden w-full transition-all duration-200 text-base
                cursor-pointer ${item.disabled ? "opacity-30" : source.uri === item.path ? "text-primary" : ""}`}
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

            <div className="custom-pagination flex gap-2 items-center justify-center mt-4"></div>
          </div>
        </div>

        <h1 className="text-left text-lg font-semibold mt-4">Recently Played</h1>

        <h1 className="text-left text-lg font-semibold mt-4">Favourites</h1>
      </LayoutHeightWrapper>
    </Page>
  );
};

export default Start;
