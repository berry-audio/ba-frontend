import Page from "@/components/Page";
import ButtonIcon from "@/components/Button/ButtonIcon";
import TruncateText from "@/components/TruncateText";
import ButtonScanLibrary from "@/components/Button/ButtonScanLibrary";
import ButtonScanArtist from "@/components/Button/ButtonScanArtist";
import ButtonClearLibrary from "@/components/Button/ButtonClearLibrary";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import NoItems from "@/components/ListItem/NoItems";

import { FolderIcon, StackSimpleIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { useStorageService } from "@/services/storage";
import { useEffect, useState } from "react";
import { useConfigService } from "@/services/config";

const SettingsLocal = () => {
  const { getConfig } = useConfigService();
  const { removeFromLibrary } = useStorageService();

  const [pathList, setPathList] = useState<string[]>();

  useEffect(() => {
    (async () => {
      await getConfig().then((config) => {
        setPathList(config["local"]["library_path"]);
      });
    })();
  }, []);

  const onClickRemovePath = async (uri: string) => {
    await removeFromLibrary(uri);
    await getConfig().then((config) => {
      setPathList(config["local"]["library_path"]);
    });
  };

  return (
    <Page
      backButton
      title="Library Folders"
      rightComponent={
        <div className="flex">
          <div className="mr-4">
            <ButtonScanLibrary disabled={!pathList?.length} />
          </div>
          <div className="mr-4">
            <ButtonScanArtist disabled={!pathList?.length} />
          </div>
          <div className="mr-4">
            <ButtonClearLibrary />
          </div>
        </div>
      }
    >
      {pathList?.length ? (
        <div className="lg:px-0 px-6 py-3">
          {pathList &&
            pathList.map((uri: string) => (
              <div key={uri} className="pl-4 pr-2 py-2 rounded-sm mt-1 flex items-center justify-between bg-popover hover:bg-primary">
                <div className="flex items-center overflow-hidden">
                  <FolderIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />
                  <TruncateText>{uri}</TruncateText>
                </div>
                <ButtonIcon className="text-right ml-5" onClick={() => onClickRemovePath(uri)}>
                  <TrashSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />
                </ButtonIcon>
              </div>
            ))}
        </div>
      ) : (
        <LayoutHeightWrapper>
          <NoItems
            title="No Folders to Scan"
            desc={"Folders added from Storage will show here"}
            icon={<StackSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />}
          />
        </LayoutHeightWrapper>
      )}
    </Page>
  );
};

export default SettingsLocal;
