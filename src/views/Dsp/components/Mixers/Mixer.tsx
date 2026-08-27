import { ICON_WEIGHT, ICON_XS } from "@/constants";
import { ArrowRightIcon } from "@phosphor-icons/react";

export const DisplayChannel = ({ text, count }: { text: string; count: number }) => {
  return (
    <div className="rounded-[5px] overflow-hidden mt-1 flex shrink-0">
      <div className="bg-cover text-primary px-2 py-1">{count}CH</div>
      <div className="bg-foreground px-2 py-1">{text}</div>
    </div>
  );
};

const Mixer = ({ name, mixer, onClick }: { name: string; mixer: any; onClick?: (name: string) => void }) => {
  return (
    <div className="flex items-center py-3 px-4" onClick={() => onClick && onClick(name)}>
      <div className="bg-cover text-primary rounded-md w-12 h-12 flex items-center justify-center text-xl mr-3">MX</div>
      <div>
        {name}
        <div className="flex mt-0.5 text-sm items-center">
          <DisplayChannel text="IN" count={mixer.channels.in} />
          <ArrowRightIcon weight={ICON_WEIGHT} size={ICON_XS} className="mr-2 mt-1 ml-2" />
          <DisplayChannel text="OUT" count={mixer.channels.out} />
        </div>
      </div>
    </div>
  );
};

export default Mixer;
