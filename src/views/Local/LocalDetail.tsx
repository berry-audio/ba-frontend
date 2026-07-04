import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useMenuActions } from "@/hooks/useMenuActions";
import { useLocalService } from "@/services/local";
import { Album, AnyItem, Artist, Track } from "@/types";
import { MODEL, REF } from "@/constants/refs";
import { DRAWER_EVENTS } from "@/store/constants";

import Page from "@/components/Page";
import ButtonPlayAll from "@/components/Button/ButtonPlayAll";
import ButtonAddToQueue from "@/components/Button/ButtonAddToQueue";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ListItem from "@/components/Item/ListItem";
import CoverArt from "@/components/CoverArt";
import ActionMenu from "@/components/Actions";
import ScrollingText from "@/components/ScrollingText";
import LocalDetailSkeleton from "./LocalDetailSkeleton";


const LocalDetail = ({ view, id }: { view: REF; id: string }) => {
  const dispatch = useDispatch();
  if (!view && !id) return;

  const { getDirectory } = useLocalService();
  const { itemsMenu } = useMenuActions();

  const [item, setItem] = useState<AnyItem>();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      const [tracks, detail] = await Promise.all([getDirectory(`${view}:${id}:tracks`), getDirectory(`${view}:${id}`)]);
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
    <Page title="" backButton backButtonOnClick={onClickBackHandler}>
      {loading ? (
        <LayoutHeightWrapper>
          <LocalDetailSkeleton />
        </LayoutHeightWrapper>
      ) : (
        <LayoutHeightWrapper className="h-[calc(100dvh-100px)]!">
          {item && (
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-60">
                  <CoverArt item={item} disable />
                </div>
              </div>

              <div className="px-3">
                <h2 className="lg:text-4xl text-3xl font-semibold">
                  <ScrollingText text={(item as Album | Artist).name} />
                </h2>

                {item.__model__ === MODEL.ARTIST && (item as Artist).country && (
                  <div className="mb-1">
                    {(item as Artist).country}, {(item as Artist).year && `Born in ${(item as Artist).year}`}
                  </div>
                )}
                {(item as Album | Artist).genre && <div className="mb-1">{(item as Album | Artist).genre}</div>}
                {item.__model__ === MODEL.ALBUM && (item as Album).date && <div className="mb-1">Released {(item as Album).date}</div>}

                <div className="flex items-center justify-center my-5 text-md">
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

          <div className="w-full mt-5">
            {tracks.map((item: Track, index: number) => (
              <ItemWrapper key={item.uri ?? index}>
                <ListItem item={item} favourite />
              </ItemWrapper>
            ))}
          </div>
        </LayoutHeightWrapper>
      )}
    </Page>
  );
};

export default LocalDetail;
