import { useEffect } from "react";
import { useTracklistActions } from "@/hooks/useTracklistActions";
import { useTracklistService } from "@/services/tracklist";
import { useDispatch, useSelector } from "react-redux";
import { QueueIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DRAWER_EVENTS } from "@/store/constants";

import ButtonPlaylistCreate from "@/components/Button/ButtonPlaylistCreate";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import SortableList from "@/components/SortableList";
import NoItems from "@/components/Item/NoItems";
import Page from "@/components/Page";
import ButtonQueueClear from "@/components/Button/ButtonQueueClear";
import ListItemSkeleton from "@/components/Item/ListItemSkeleton";

const Tracklist = () => {
  const dispatch = useDispatch();

  const { moveTrack } = useTracklistService();
  const { tracklistFetch, loading } = useTracklistActions();
  const { tl_tracks } = useSelector((state: any) => state.tracklist);

  useEffect(() => {
    (async () => {
      await tracklistFetch();
    })();
  }, []);

  const onClickBack = () => {
    dispatch({
      type: DRAWER_EVENTS.DRAWER_CLOSE,
      payload: null,
    });
  };

  return (
    <Page
      backButton
      backButtonOnClick={onClickBack}
      title="Now Playing"
      rightComponent={
        <div className="flex">
          <div className="mr-3">
            <ButtonQueueClear />
          </div>
          <div className="mr-3">
            <ButtonPlaylistCreate fromQueue={true} />
          </div>
        </div>
      }
    >
      <div className="mt-5">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div className="ml-3" key={i}>
              <ListItemSkeleton key={i} />
            </div>
          ))}
        {!loading && tl_tracks?.length ? (
          <SortableList tracks={tl_tracks} onMoveCallback={moveTrack} />
        ) : (
          <LayoutHeightWrapper>
            <NoItems title="No tracks in queue" desc={"Add some music"} icon={<QueueIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
          </LayoutHeightWrapper>
        )}
      </div>
    </Page>
  );
};

export default Tracklist;
