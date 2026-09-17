import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useMenuActions } from "@/hooks/useMenuActions";
import { useLocalService } from "@/services/local";
import { Album, AnyItem, Artist, Track } from "@/types";
import { CaretLeftIcon } from "@phosphor-icons/react";
import { MODEL, REF } from "@/constants/refs";
import { DRAWER_EVENTS } from "@/store/constants";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ButtonPlayAll from "@/components/Button/ButtonPlayAll";
import ButtonAddToQueue from "@/components/Button/ButtonAddToQueue";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ListItem from "@/components/Item/ListItem";
import CoverArt from "@/components/CoverArt";
import ActionMenu from "@/components/Actions";
import ScrollingText from "@/components/ScrollingText";
import LocalDetailSkeleton from "./LocalDetailSkeleton";
import ButtonIcon from "@/components/Button/ButtonIcon";

const LocalDetail = ({ ext, view, id }: { ext: string; view: REF; id: string }) => {
  const dispatch = useDispatch();
  if (!view && !id) return;

  const { getDirectory } = useLocalService();
  const { itemsMenu } = useMenuActions();

  const [item, setItem] = useState<AnyItem>();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      const [tracks, detail] = await Promise.all([getDirectory(`${ext}:${view}:${id}:tracks`), getDirectory(`${ext}:${view}:${id}`)]);
      setTracks(tracks);
      setItem(detail[0]);
      setLoading(false);
    };

    fetch();
  }, [view, id]);

  const onClickBackHandler = () => {
    dispatch({
      type: DRAWER_EVENTS.DRAWER_CLOSE,
      payload: null,
    });
  };

  return (
    <div className="h-full overflow-auto relative">
      {item && (
        <div className="relative h-120 overflow-hidden">
          <div className="relative scale-105 lg:scale-100">
            <CoverArt item={item} disable detail={true} />
          </div>

          <div
            className="absolute bottom-17 lg:bottom-0 left-0 right-0 h-125"
            style={{
              background: "linear-gradient(to top, var(--background-secondary) 10%, transparent 60%)",
            }}
          />

          {item.__model__ === MODEL.ALBUM && (
            <div className="absolute top-15 left-1/2 -translate-x-1/2  w-[60%] lg:w-[40%] rounded-lg overflow-hidden shadow-md">
              <CoverArt item={item} disable />
            </div>
          )}

          <ButtonIcon onClick={onClickBackHandler} className="absolute top-5 left-3 lg:left-5 bg-secondary opacity-70">
            <CaretLeftIcon weight={ICON_WEIGHT} size={ICON_SM} />
          </ButtonIcon>

          <div className="absolute bottom-2 left-7 lg:left-10 w-full">
            <h2 className="lg:text-4xl text-3xl font-semibold mb-1 -ml-3 pr-30 text-shadow-2xs">
              <ScrollingText text={(item as Album | Artist).name} />
            </h2>
            {item.__model__ === MODEL.ARTIST && (item as Artist).country && (
              <div className="-ml-3">
                {(item as Artist).country}, {(item as Artist).year && `Born in ${(item as Artist).year}`}, &nbsp;
                {(item as Album | Artist).genre && (item as Album | Artist).genre}
              </div>
            )}

            {item.__model__ === MODEL.ALBUM && (item as Album).date && <div className="-ml-3">Released {(item as Album).date}</div>}

            <div className="flex items-center text-md mt-4">
              <div className="mr-2 -ml-3">
                <ButtonPlayAll item={item} />
              </div>
              <div className="mr-2">
                <ButtonAddToQueue item={item} />
              </div>
              <div className="mr-1">
                <ActionMenu items={itemsMenu(item)} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center  lg:px-3">
        <div className={`lg:max-w-200 w-full`}>
          {loading ? (
            <LayoutHeightWrapper>
              <LocalDetailSkeleton />
            </LayoutHeightWrapper>
          ) : (
            <div className="w-full mt-5">
              {tracks.map((item: Track, index: number) => (
                <ItemWrapper key={item.uri ?? index}>
                  <ListItem item={item} showFavourite />
                </ItemWrapper>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalDetail;
