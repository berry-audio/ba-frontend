import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSubtitle, getTitle } from "@/util";

import CoverArt from "../CoverArt";
import ScrollingText from "../ScrollingText";
import SourceDevice from "../Source/SourceDevice";

const MetaDisplay = ({ size = "sm", onClick }: { size?: "sm" | "md"; onClick?: () => void }) => {
  const { current_track } = useSelector((state: RootState) => state.player);
  const { source } = useSelector((state: any) => state.source);

  if (!current_track) {
    return null;
  }

  const title = getTitle(current_track?.track);
  const subtitle = getSubtitle(current_track?.track);

  if (size === "sm") {
    return (
      <div className="flex items-center p-2 w-4/6 z-20 relative">
        <div onClick={onClick} className="w-full cursor-pointer text-left">
          <div className="flex items-center">
            <div className="overflow-hidden rounded-sm mr-3 min-w-10 w-10">
              <CoverArt item={current_track.track} loadingPlay={false} disable />
            </div>

            {source.uri && (
              <div className="text-left overflow-hidden">
                <h2 className="tracking-tight text-white">{title ? <ScrollingText text={title} /> : source.name}</h2>

                <div className="text-secondary mt-0 lg:-mt-1 text-sm">{subtitle ? <ScrollingText text={subtitle} /> : <SourceDevice />}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // md
  return (
    <div onClick={onClick} className="flex items-center cursor-pointer w-full text-left">
      <div className="flex items-center grow">
        <div className="overflow-hidden flex-none rounded-sm mr-3 w-12.5 min-w-12.5">
          <CoverArt item={current_track.track} loadingPlay={false} disable />
        </div>

        {source.uri && (
          <div className="overflow-hidden max-w-80">
            <h2 className="tracking-tight">{title ? <ScrollingText text={title} /> : source.name}</h2>

            <div className="text-secondary overflow-hidden text-md">{subtitle ? <ScrollingText text={subtitle} /> : <SourceDevice />}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaDisplay;
