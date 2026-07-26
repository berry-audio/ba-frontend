import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnyItem, Track } from "@/types";
import { getSubtitle } from "@/util";
import { usePlayNow } from "@/hooks/usePlayNow";
import { useMenuActions } from "@/hooks/useMenuActions";
import { useFavourites } from "@/hooks/useFavourites";
import { MODEL } from "@/constants/refs";

import CoverArt from "../CoverArt";
import TruncateText from "../TruncateText";
import ActionMenu from "../Actions";

interface GridItemProps {
  item: AnyItem;
  shadow?: boolean;
  onClickCoverArt?: () => void;
  onClick?: (item: AnyItem) => void;
  cover_only?: boolean;
  style?: CSSProperties;
  onMeasure?: (height: number) => void;
  showFavourite?: boolean;
}

const GridItem = ({ item, shadow = false, onClick, style, onMeasure, showFavourite = false }: GridItemProps) => {
  const title = (item as Track).name;
  const subtitle = getSubtitle(item);
  const divRef = useRef<HTMLDivElement>(null);

  const { handlePlayNow } = usePlayNow();
  const { toggleFavourite, isFavourite, mergeFavourite, loading: loadingFavourite } = useFavourites();
  const { itemsMenu } = useMenuActions();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCover, setLoadingCover] = useState<boolean>(false);
  const [favourite, setFavourite] = useState<boolean>(isFavourite(item))


  const onClickItem = async () => {
    setLoading(true);
    try {
      await Promise.resolve(onClick?.(item));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!divRef.current || !onMeasure) return;
    const img = divRef.current.querySelector("img");
    if (img && !img.complete) {
      img.addEventListener(
        "load",
        () => {
          onMeasure(divRef?.current!.getBoundingClientRect().height);
        },
        { once: true },
      );
    } else {
      onMeasure(divRef.current.getBoundingClientRect().height);
    }
  }, []);

  const onClickCoverArt = async () => {
    setLoadingCover(true);
    try {
      await handlePlayNow(item);
    } finally {
      setLoadingCover(false);
    }
  };

  return (
    <div
      className="cursor-pointer relative p-2 lg:p-3 pb-6 hover:bg-hover rounded-md transition-all duration-200"
      onClick={onClickItem}
      ref={divRef}
      style={style}
    >
      <div className="w-full">
        <div>
          <CoverArt
            item={item}
            size="lg"
            shadow={shadow}
            loadingPlay={loading || loadingCover}
            loadingFavourite={loadingFavourite}
            favourited={favourite}
            onClickPlay={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              onClickCoverArt();
            }}
            {...(showFavourite &&
              [MODEL.ARTIST, MODEL.ALBUM, MODEL.TRACK, MODEL.TLTRACK].includes(item.__model__) && {
                onClickFavourite: async (e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  setFavourite(await toggleFavourite(item))
                },
              })}
          />
        </div>
        <div className="flex justify-between mt-2">
          <div className="overflow-hidden text-left">
            {title && (
              <h2 className="tracking-tight">
                <TruncateText>{title}</TruncateText>
              </h2>
            )}
            {subtitle && (
              <div className="text-secondary text-md">
                <TruncateText>{subtitle}</TruncateText>
              </div>
            )}
          </div>
          {itemsMenu(item).length > 0 && (
            <div className="-mr-2" onClick={(e) => e.stopPropagation()}>
              <ActionMenu items={itemsMenu(mergeFavourite(item, favourite))} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GridItem;
