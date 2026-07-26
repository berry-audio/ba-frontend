import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCollectionService } from "@/services/collection";
import { FolderSimpleIcon } from "@phosphor-icons/react";
import { Album, AnyItem, Artist, ViewMode } from "@/types";
import { MODEL, REF } from "@/constants/refs";
import { DRAWER_EVENTS } from "@/store/constants";
import { ICON_WEIGHT, ICON_XS } from "@/constants";

import Page from "@/components/Page";
import Grid from "../../components/InfiniteScroll/Grid";
import List from "../../components/InfiniteScroll/List";
import Tabs from "@/components/ui/tabs";
import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";

const Collection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { view } = useParams<{ view: REF }>();
  const { getDirectory } = useCollectionService();

  const [layout, setLayout] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState<REF>(view as REF);

  useEffect(() => {
    if (!view) return;
    setActiveTab(view);
  }, [view]);

  const directory = {
    [REF.RECENT]: {
      title: "Recently Played",
      icon: <FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    [REF.TOP100]: {
      title: "Top 100",
      icon: <FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    [REF.FAVOURITE]: {
      title: "Favourites",
      icon: <FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
  } as const;

  const onClickItem = async (item: AnyItem) => {
    if (item.__model__ === MODEL.TRACK) return;
    const [ext, view, id] = (item as Artist | Album)?.uri.split(":");

    dispatch({
      type: DRAWER_EVENTS.DRAWER_LOCAL,
      payload: { ext, view, id },
    });
  };

  const onTabChange = (tab: REF) => {
    setActiveTab(tab);
    navigate(`/collection/${tab}`);
  };

  if (!view) return null;

  return (
    <Page
      wfull={layout === "grid"}
      title={<Tabs activeTab={activeTab} onTabChange={onTabChange} items={directory} />}
      rightComponent={
        <div className="mr-4">
          <ButtonLayoutToggle setLayoutype={setLayout} layoutType={layout} />
        </div>
      }
      backButton
    >
      {layout === "list" && <List uri={`collection:${view}`} getDirectory={getDirectory} onClickCallback={onClickItem} alphabets favourite />}
      {layout === "grid" && <Grid uri={`collection:${view}`} getDirectory={getDirectory} onClickCallback={onClickItem} alphabets favourite />}
    </Page>
  );
};

export default Collection;
