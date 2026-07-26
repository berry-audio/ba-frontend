import { useState } from "react";
import { getImage, getTitle } from "@/util";
import { Album, AnyItem, Bluetooth } from "@/types";
import { PlayCircleIcon, HeartIcon } from "@phosphor-icons/react";
import { ICON_LG, ICON_SM, ICON_XS } from "@/constants";
import { MODEL } from "@/constants/refs";

import Placeholder from "./Placeholder";
import Spinner from "../Spinner";

interface CoverArt {
  item: AnyItem;
  size?: "sm" | "lg";
  shadow?: boolean;
  loadingPlay?: boolean;
  loadingFavourite?: boolean;
  favourited?: boolean;
  disable?: boolean;
  onClickPlay?: (e: React.MouseEvent<HTMLElement>) => void;
  onClickFavourite?: (e: React.MouseEvent<HTMLElement>) => void;
}

const CoverArt = ({
  item,
  size = 'sm',
  shadow = false,
  loadingPlay = false,
  loadingFavourite = false,
  disable = false,
  favourited = false,
  onClickPlay,
  onClickFavourite,
}: CoverArt) => {
  const title = getTitle(item);
  const src = getImage(item);

  const [imgError, setImgError] = useState(false);

  if (!item) {
    return <Placeholder item={{ __model__: MODEL.ALBUM } as Album} />;
  }

  return (
    <div className="w-full relative">
      <div className={`overflow-hidden rounded-md transition-all ${shadow ?? "shadow-[1px_14px_21px_-6px_rgba(0,0,0,0.9)]"}`}>
        {src && !imgError ? (
          <img
            src={src}
            alt={title}
            className="object-cover w-full h-full aspect-square grayscale-20 inline-block scale-101 hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <Placeholder item={item} variant={(item as Bluetooth).connected ? "" : "primary"} />
        )}

        {[MODEL.ALBUM, MODEL.ARTIST, MODEL.CATEGORY, MODEL.FILE, MODEL.TRACK, MODEL.TUNER, MODEL.TLTRACK, MODEL.PLAYLIST].includes(item.__model__) &&
          !disable && (
            <>
              {onClickFavourite && favourited && (
                <button
                  onClick={onClickFavourite}
                  className="absolute top-2.5 right-2 cursor-pointer flex items-center justify-center z-3 text-primary hover:text-foreground w-8 h-8 rounded-full"
                >
                  {loadingFavourite ? <Spinner mode="light" /> : <HeartIcon size={ICON_XS} weight="fill" />}
                </button>
              )}

              <div
                className={`absolute top-0 left-0 w-full h-full rounded-md z-2 ${
                  loadingPlay || loadingFavourite ? "opacity-100" : "opacity-0 hover:opacity-100"
                } hover:bg-black/50 transition duration-150`}
              >
                {onClickPlay && (
                  <button
                    onClick={onClickPlay}
                    className="absolute inset-0 cursor-pointer rounded-md flex items-center justify-center z-3 text-white"
                  >
                    {loadingPlay ? <Spinner mode="light" /> : <PlayCircleIcon size={size === 'sm' ? ICON_SM : ICON_LG} weight="fill" />}
                  </button>
                )}

                {onClickFavourite && !favourited && (
                  <button
                    onClick={onClickFavourite}
                    className="absolute top-2.5 right-2 cursor-pointer flex items-center justify-center z-3  hover:text-primary w-8 h-8 rounded-full"
                  >
                    {loadingFavourite ? <Spinner mode="light" /> : <HeartIcon size={ICON_XS} weight="regular" />}
                  </button>
                )}
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default CoverArt;
