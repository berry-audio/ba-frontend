import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useStorageService } from "@/services/storage";
import { useStorageActions } from "@/hooks/useStorageActions";
import { EjectSimpleIcon, GearIcon, HardDriveIcon } from "@phosphor-icons/react";
import { StorageItem, StorageList, Item } from "@/types";
import { formatBytes, splitUri } from "@/util";
import { ACTIONS } from "@/constants/actions";
import { ICON_SM, ICON_WEIGHT, ICON_XS } from "@/constants";
import { REF } from "@/constants/refs";

import Page from "@/components/Page";
import Spinner from "@/components/Spinner";
import ActionMenu from "@/components/Actions";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ListItem from "@/components/ListItem";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ItemPadding from "@/components/Wrapper/ItemPadding";
import ButtonIcon from "@/components/Button/ButtonIcon";

const Storage = () => {
  const connected = useSelector((state: any) => state.socket.connected);
  const navigate = useNavigate();

  const { getStorage, setMount, setUnMount, setShare, setUnshare, addToLibrary } = useStorageService();
  const { fetchStorages, loading } = useStorageActions();
  const { storages, last_shared_event } = useSelector((state: any) => state.storage);
  const { "*": path } = useParams<{ "*": string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dirlist, setDirList] = useState<any[]>([]);
  const [dirCur, setDirCur] = useState<string>();

  useEffect(() => {
    if (!connected) return;
    fetchStorages();
  }, [connected]);

    useEffect(() => {
    if (!last_shared_event) return;
    setDirList(prev => prev.map(item => {
        if (item.uri !== last_shared_event.uri) return item;
        return { ...item, shared: last_shared_event.event === "storage_shared" };
    }));
}, [last_shared_event]);

  useEffect(() => {
    const fetchStorage = async () => {
      setIsLoading(true);

      if (path) {
        const res = await getStorage(`storage:/${path}`);
        setDirList(res);
        const cur_dir = path.split("/");
        setDirCur(cur_dir[cur_dir.length - 1]);
      } else {
        setDirList([]);
        navigate(`/storage`);
      }

      setIsLoading(false);
    };

    fetchStorage();
  }, [path]);

  const onClickActionMenu = async (action: ACTIONS, item: Item) => {
    if (action === ACTIONS.ADD_LIBRARY) {
      await addToLibrary(item.uri);
    }

    if (action === ACTIONS.DIRECTORY_SHARE) {
      await setShare(item.uri);
    }

    if (action === ACTIONS.DIRECTORY_UNSHARE) {
      await setUnshare(item.uri);
    }
  };

  const onClickHandler = async (item: Item) => {
    if (item.type === REF.DIRECTORY) {
      fetchDir(item.uri);
    }
  };

  const onClickActionHandler = async (action: string, dev: string) => {
    if (action === "mount") {
      await setMount(dev);
    } else if (action === "unmount") {
      await setUnMount(dev);
    }
  };

  const fetchDir = async (uri: string) => {
    const { path } = splitUri(uri);
    navigate(`/storage${path}`);
  };

  const ListItemStorage = ({ item, mounted }: { item: StorageItem; mounted: boolean }) => {
    const actionItems = [
      {
        name: "Mount",
        icon: <HardDriveIcon size={ICON_XS} weight={ICON_WEIGHT} />,
        action: () => onClickActionHandler("mount", item.dev),
        hide: item.status == "mounted",
      },
      {
        name: "Eject",
        icon: <EjectSimpleIcon size={ICON_XS} weight={ICON_WEIGHT} />,
        action: () => onClickActionHandler("unmount", item.dev),
        hide: item.status == "unmounted",
      },
    ];

    return (
      <div className="w-full">
        <div className="flex justify-between">
          <button onClick={() => mounted && fetchDir(item.uri)} className="cursor-pointer w-full">
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
          <div className="-mr-2">
            <ActionMenu items={actionItems} />
          </div>
        </div>

        <div className="w-full bg-popover rounded-full h-1 mt-3 mb-1">
          <div className={`${mounted ? "bg-primary" : ""} h-1 rounded-full`} style={{ width: `${item.percent}%` }}></div>
        </div>
      </div>
    );
  };

  return dirlist?.length > 0 ? (
    <Page
      backButton
      title={dirCur || "Storage"}
      rightComponent={
        <div className="mr-4">
          <ButtonIcon onClick={() => navigate("/settings/local")}>
            <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />
          </ButtonIcon>
        </div>
      }
    >
      {isLoading || loading ? (
        <LayoutHeightWrapper>
          <Spinner />
        </LayoutHeightWrapper>
      ) : (
        dirlist.map((item, index) => (
          <ItemWrapper key={index}>
            <ListItem item={item} onClickCallback={onClickHandler} onClickActionCallback={onClickActionMenu} />
          </ItemWrapper>
        ))
      )}
    </Page>
  ) : (
    <Page
      backButton
      title="Storage"
      rightComponent={
        <div className="mr-4">
          <ButtonIcon onClick={() => navigate("/settings/local")}>
            <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />
          </ButtonIcon>
        </div>
      }
    >
      {isLoading ? (
        <LayoutHeightWrapper>
          <Spinner />
        </LayoutHeightWrapper>
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
