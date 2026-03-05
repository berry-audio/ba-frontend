import { ICON_XS } from "@/constants";
import { NetworkIcon } from "lucide-react";

export const SharedUnsharedIcon = ({ shared = false, classname = "" }: { shared?: boolean; classname?: string }) => {
  return shared ? (
    <div className={`bg-primary inline-block rounded-full p-[4px] ${classname}`}>
      <NetworkIcon className="text-white" size={ICON_XS - 7} />
    </div>
  ) : (
    <></>
  );
};
