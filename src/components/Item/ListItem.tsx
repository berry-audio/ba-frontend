import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePlayNow } from "@/hooks/usePlayNow";
import { useFavourites } from "@/hooks/useFavourites";
import { useMenuActions } from "@/hooks/useMenuActions";
import { CheckCircleIcon, CircleIcon, MusicNotesIcon, HeartIcon } from "@phosphor-icons/react";
import { formatNo, getDuration, getFavourite, getSubtitle, getTitle, getUri } from "@/util";
import { AnyItem, Storage } from "@/types";
import { ICON_SM, ICON_XS } from "@/constants";
import { EVENTS } from "@/constants/events";
import { MODEL } from "@/constants/refs";

import TruncateText from "../TruncateText";
import ListImageWrapper from "../Wrapper/ListImageWrapper";
import CoverArt from "../CoverArt";
import ActionMenu from "../Actions";
import Spinner from "../Spinner";

interface ListItem {
  no?: number;
  item: AnyItem;
  image?: string;
  selected?: boolean;
  onClick?: () => void;
  selectable?: boolean;
  showFavourite?: boolean;
}

const ListItem = ({ no, item: _item, selected = false, onClick, selectable = false, showFavourite = false }: ListItem) => {
  const action = useSelector((state: any) => state.event);
  
  const { handlePlayNow } = usePlayNow();
  const { itemsMenu } = useMenuActions();
  const { toggleFavourite, loading: loadingFavourite } = useFavourites();

  const [item, setItem] = useState<any>(_item);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCover, setLoadingCover] = useState<boolean>(false);

  const title = getTitle(item);
  const subtitle = getSubtitle(item);
  const duration = getDuration(item);
  const mounted = (item as Storage).status == "mounted";
  const usage = (item as Storage)?.usage;

  useEffect(() => {
    if (![EVENTS.FAVOURITE_ADDED, EVENTS.FAVOURITE_REMOVED].includes(action.event)) {
      return;
    }
    if (getUri(action.payload.item) !== getUri(item)) {
      return;
    }
    setItem(action.payload.item);
  }, [action]);

  const onClickItem = async () => {
    setLoading(true);
    try {
      await Promise.resolve(onClick?.());
    } finally {
      setLoading(false);
    }
  };

  const onClickCoverArt = async () => {
    setLoadingCover(true);
    try {
      await handlePlayNow(item);
    } finally {
      setLoadingCover(false);
    }
  };

  return (
    <>
      <div onClick={onClickItem} className="flex items-center w-full cursor-pointer justify-between relative group">
        <div className="py-3 px-4 flex justify-between w-full items-center">
          <div className="flex items-center w-full">
            {no && <div className="-ml-1 mr-4 text-sm text-secondary w-2.5 text-center">{formatNo(no)}</div>}
            <ListImageWrapper>
              <CoverArt
                item={item}
                loadingPlay={loadingCover || loading}
                onClickPlay={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  onClickCoverArt();
                }}
              />
            </ListImageWrapper>
            <div className="grow ">
              <div className="flex items-center text-left">
                <div className="flex flex-col overflow-hidden w-0 grow pr-5">
                  <h2 className="tracking-tight flex items-center">
                    <TruncateText>{title}</TruncateText>
                    {selected && !selectable && <MusicNotesIcon className="text-primary inline-block ml-2" weight={"fill"} size={15} />}
                  </h2>
                  {subtitle && (
                    <div className={`${window.innerHeight < 400 ? "mt-0" : "mt-0"} text-secondary text-md`}>
                      <TruncateText>{subtitle as string}</TruncateText>
                    </div>
                  )}
                  {usage && (
                    <div className="w-full bg-foreground rounded-full h-1 mt-3 mb-1">
                      {usage.used && usage.total && (
                        <div
                          className={`${mounted ? "bg-primary" : ""} h-1 rounded-full`}
                          style={{
                            width: `${(usage.used / usage.total) * 100}%`,
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
                {duration && <div className="mr-4 text-secondary text-sm ">{duration}</div>}
                {showFavourite && [MODEL.ARTIST, MODEL.ALBUM, MODEL.TRACK, MODEL.TLTRACK].includes(item.__model__) && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await toggleFavourite(item);
                    }}
                    className={`cursor-pointer rounded-md flex items-center justify-center z-3 ${
                      getFavourite(item) ? "text-primary opacity-100 hover:text-foreground" : "opacity-0 group-hover:opacity-100 hover:text-primary"
                    }`}
                  >
                    {loadingFavourite ? <Spinner mode="light" /> : <HeartIcon size={ICON_XS} weight={getFavourite(item) ? "fill" : "regular"} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectable ? (
        <div className="pr-4">
          {selected ? <CheckCircleIcon weight="fill" size={ICON_SM} className="text-primary" /> : <CircleIcon size={25} className="opacity-50" />}
        </div>
      ) : (
        itemsMenu(item).length > 0 && (
          <div className="pr-2" onClick={(e) => e.stopPropagation()}>
            <ActionMenu items={itemsMenu(item)} />
          </div>
        )
      )}
    </>
  );
};

export default ListItem;
