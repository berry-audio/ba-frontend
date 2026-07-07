import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FolderSimpleIcon, MusicNotesIcon, UserIcon, VinylRecordIcon } from "@phosphor-icons/react";
import { useLocalService } from "@/services/local";
import { Album, AnyItem, Artist, ViewMode } from "@/types";
import { MODEL, REF } from "@/constants/refs";
import { DRAWER_EVENTS } from "@/store/constants";
import { ICON_WEIGHT, ICON_XS } from "@/constants";

import Page from "@/components/Page";
import Grid from "../../components/InfiniteScroll/Grid";
import List from "../../components/InfiniteScroll/List";
import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";
import Tabs from "@/components/ui/tabs";

const Local = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { view } = useParams<{ view: REF; id: string }>();
  const { getDirectory } = useLocalService();

  const [layout, setLayout] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState<REF>(view as REF);

  const directory = {
    [REF.ALBUM]: {
      title: "Albums",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    [REF.ARTIST]: {
      title: "Artists",
      icon: <UserIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    [REF.GENRE]: {
      title: "Genre",
      icon: <FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
    [REF.TRACK]: {
      title: "Tracks",
      icon: <MusicNotesIcon weight={ICON_WEIGHT} size={ICON_XS} />,
    },
  } as const;

  const onClickItem = async (item: AnyItem) => {
    if (item.__model__ === MODEL.TRACK) return;
    const [view, id] = (item as Artist | Album)?.uri.split(":");
    dispatch({
      type: DRAWER_EVENTS.DRAWER_LOCAL,
      payload: { view, id },
    });
  };

  const onTabChange = (tab: REF) => {
    setActiveTab(tab);
    navigate(`/local/${tab}`);
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
      {layout === "list" && <List uri={view} getDirectory={getDirectory} onClickCallback={onClickItem} alphabets favourite />}
      {layout === "grid" && <Grid uri={view} getDirectory={getDirectory} onClickCallback={onClickItem} alphabets favourite />}
    </Page>
  );
};

export default Local;
