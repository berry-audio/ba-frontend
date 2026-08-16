import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { fetchJsonRpc, getSampleRate } from "@/util";
import { CpuIcon, HardDriveIcon, WaveformIcon, WaveSineIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";

const Status = () => {
  const [result, setResult] = useState<any | null>(null);

  const fetchStatus = useCallback(async (): Promise<void> => {
    try {
      const data = await fetchJsonRpc<any>("dsp.status", 101);
      setResult(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      fetchStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const ListUsageItem = ({
    title,
    desc,
    percent,
    hires,
    hd,
  }: {
    title: React.ReactNode;
    desc: string;
    percent: number;
    hires?: boolean;
    hd?: boolean;
  }) => {
    return (
      <div>
        <div className="flex items-center">{title}</div>
        <div className="w-full">
          <div className="mb-1 text-secondary text-md mt-1">
            {desc}{" "}
            {hires && (
              <span className="rounded-sm bg-text px-1 py-0.5 text-xxs font-black text-invert ml-1 relative -top-0.5">Hi-Res</span>
            )}
            {hd && (
              <span className="rounded-sm bg-text px-1 py-0.5 text-xxs font-black text-invert ml-1 relative -top-0.5">HQ</span>
            )}
          </div>
          <div className="w-full bg-foreground rounded-full h-1 mt-3 mb-1">
            <div className="bg-primary h-1 rounded-full" style={{ width: `${percent}%` }}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-6 md:col-span-3">
          <ListUsageItem
            title={
              <>
                <WaveSineIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />
                Sample Rate
              </>
            }
            hires={result?.capturerate > 48000}
            hd={result?.capturerate === 48000}
            desc={`${result?.capturerate ? `${getSampleRate(result.capturerate)}` : "--"}`}
            percent={(result?.capturerate / 384000) * 100}
          />
        </div>
        <div className="col-span-6 md:col-span-3">
          <ListUsageItem
            title={
              <>
                <CpuIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />
                DSP Load
              </>
            }
            desc={`${result?.processingload.toFixed(1)}%`}
            percent={result?.processingload}
          />
        </div>

        <div className="col-span-6 md:col-span-3 mt-3 md:mt-0">
          <ListUsageItem
            title={
              <>
                <WaveformIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />
                Resampler Load
              </>
            }
            desc={`${result?.resamplerload}%`}
            percent={result?.resamplerload}
          />
        </div>

        <div className="col-span-6 md:col-span-3 mt-3 md:mt-0">
          <ListUsageItem
            title={
              <>
                <HardDriveIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />
                Buffer
              </>
            }
            desc={`${result?.bufferlevel} bytes`}
            percent={result?.bufferlevel > 0 ? 100 : 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Status;
