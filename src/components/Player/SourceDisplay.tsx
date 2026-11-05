import { RootState } from "@/store";
import { useSelector } from "react-redux";
import CoverArt from "../CoverArt";

const SourceDisplay = () => {
  const { current_track } = useSelector((state: RootState) => state.player);
  const { source } = useSelector((state: any) => state.source);

  if (current_track) return;
  if (!source) return null;

  return (
    <div onClick={undefined} className="flex items-center cursor-pointer w-full text-left">
      <div className="flex items-center grow">
        <div className="overflow-hidden flex-none rounded-md mr-3 w-12.5 min-w-12.5">
          <CoverArt disable />
        </div>

        {source.uri && (
          <div className="overflow-hidden max-w-80">
            <h2 className="tracking-tight">{source.name}</h2>
            <div className="text-secondary overflow-hidden text-md">{source?.state?.name}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SourceDisplay;
