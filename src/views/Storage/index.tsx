import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useStorageService } from "@/services/storage";
import { useStorageActions } from "@/hooks/useStorageActions";
import { EjectSimpleIcon, FolderOpenIcon, GearIcon, HardDriveIcon } from "@phosphor-icons/react";
import { StorageItem, StorageList, Item, ViewMode } from "@/types";
import { formatBytes } from "@/util";
import { ACTIONS } from "@/constants/actions";
import { ICON_SM, ICON_WEIGHT, ICON_XS } from "@/constants";
import { REF } from "@/constants/refs";

import Page from "@/components/Page";
import Spinner from "@/components/Spinner";
import ActionMenu from "@/components/Actions";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ItemPadding from "@/components/Wrapper/ItemPadding";
import ButtonIcon from "@/components/Button/ButtonIcon";
import List from "@/components/InfiniteScroll/List";
import Grid from "@/components/InfiniteScroll/Grid";
import NoItems from "@/components/ListItem/NoItems";
import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";

const Storage = () => {
  const navigate = useNavigate();

  const { getDirectory, setMount, setUnMount, setShare, setUnshare, addToLibrary } = useStorageService();
  const { fetchStorages, loading } = useStorageActions();
  const { storages } = useSelector((state: any) => state.storage);
  const { "*": path } = useParams<{ "*": string }>();

  const [layout, setLayout] = useState<ViewMode>("list");
  const [dirCur, setDirCur] = useState<string>();

  useEffect(() => {
    fetchStorages();
  }, []);

  useEffect(() => {
    if (!path) return;
    const cur_dir = path.split("/");
    setDirCur(cur_dir[cur_dir.length - 1]);
  }, [path]);

  const onClickActionMenu = async (action: ACTIONS, _item: Item | StorageItem) => {
    const item = _item as StorageItem;

    switch (action) {
      case ACTIONS.ADD_LIBRARY:
        await addToLibrary(item.uri);
        break;
      case ACTIONS.DIRECTORY_SHARE:
        await setShare(item.uri);
        break;
      case ACTIONS.DIRECTORY_UNSHARE:
        await setUnshare(item.uri);
        break;
      case ACTIONS.MOUNT:
        await setMount(item.dev);
        break;
      case ACTIONS.UNMOUNT:
        await setUnMount(item.dev);
        break;
    }
  };

  const onClickItem = async (item: Item | StorageItem) => {
    if (item.type === REF.TRACK) return;
    const path = item.uri.replace("storage:", "");
    navigate(`/storage${path}`);
  };

  const ListItemStorage = ({ item, mounted }: { item: StorageItem; mounted: boolean }) => {
    const actionItems = [
      {
        name: "Mount",
        icon: <HardDriveIcon size={ICON_XS} weight={ICON_WEIGHT} />,
        action: () => onClickActionMenu(ACTIONS.MOUNT, item),
        hide: item.status == "mounted",
      },
      {
        name: "Eject",
        icon: <EjectSimpleIcon size={ICON_XS} weight={ICON_WEIGHT} />,
        action: () => onClickActionMenu(ACTIONS.UNMOUNT, item),
        hide: item.status == "unmounted",
      },
    ];

    return (
      <div className="w-full">
        <div className="flex justify-between">
          <button onClick={() => mounted && onClickItem(item)} className="cursor-pointer w-full">
            <div className="font-medium">
              <div className="w-full flex">
                <div className="flex text-lg ">
                  <HardDriveIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />
                  {item.name}
                </div>
              </div>
              <div className="mb-1  text-secondary text-left">{`${
                mounted ? `${formatBytes(item.free)} available of ${formatBytes(item.total)}` : "Unmounted"
              }`}</div>
            </div>
          </button>
          <div className="-mr-2">{item.removable && <ActionMenu items={actionItems} />}</div>
        </div>

        <div onClick={() => mounted && onClickItem(item)} className="w-full bg-popover rounded-full h-1 mt-3 mb-1">
          <div className={`${mounted ? "bg-primary" : ""} h-1 rounded-full`} style={{ width: `${item.percent}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <Page
      backButton
      wfull={layout === "grid" && path != ""}
      title={dirCur || "Storage"}
      rightComponent={
        <div className="flex items-center">
          <div className="mr-2">
            <ButtonLayoutToggle setLayoutype={setLayout} layoutType={layout} />
          </div>
          <div className="mr-4">
            <ButtonIcon onClick={() => navigate("/settings/local")}>
              <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />
            </ButtonIcon>
          </div>
        </div>
      }
    >
      {path ? (
        loading ? (
          <LayoutHeightWrapper>
            <Spinner />
          </LayoutHeightWrapper>
        ) : (
          <>
            {layout === "list" && (
              <List
                uri={`storage:/${path}`}
                getDirectory={getDirectory}
                onClickCallback={onClickItem}
                onClickActionCallback={onClickActionMenu}
                emptyComponent={<NoItems title="Empty Folder" desc="No files here" icon={<FolderOpenIcon weight={ICON_WEIGHT} size={ICON_SM} />} />}
              />
            )}
            {layout === "grid" && (
              <Grid
                uri={`storage:/${path}`}
                getDirectory={getDirectory}
                onClickCallback={onClickItem}
                onClickActionCallback={onClickActionMenu}
                emptyComponent={<NoItems title="Empty Folder" desc="No files here" icon={<FolderOpenIcon weight={ICON_WEIGHT} size={ICON_SM} />} />}
              />
            )}
          </>
        )
      ) : (
        Object.keys(storages).map((key) => {
          const storage: StorageItem[] = storages[key as keyof StorageList];
          return storage.map((item: StorageItem) => (
            <ItemWrapper key={item.dev}>
              <ItemPadding>
                <ListItemStorage mounted={key === "mounted"} item={item} />
              </ItemPadding>
            </ItemWrapper>
          ));
        })
      )}
    </Page>
  );
};
export default Storage;
