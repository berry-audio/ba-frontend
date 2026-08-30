import { fetchJsonRpc } from "@/util";
import { useCallback, useEffect, useState } from "react";

type Levels = {
  playback_rms: number[];
  playback_peak: number[];
  capture_rms: number[];
  capture_peak: number[];
};

type Labels = {
  playback: (string | null)[];
  capture: (string | null)[] | null;
};

type DspResult = {
  levels: Levels;
  labels: Labels;
};

type MeterRowProps = {
  label: string;
  rms: number;
  peak: number;
};

type MeterGroupProps = {
  title: string;
  rmsArr: number[];
  peakArr: number[];
  labels: (string | null)[] | null;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function dbToPercent(db: number | null | undefined): number {
  if (db === undefined || db === null || Number.isNaN(db)) {
    return 0;
  }

  let value: number;

  if (db >= -12) {
    value = 56.25 + ((100 - 56.25) * (db - -12)) / (0 - -12);
  } else if (db >= -24) {
    value = 43.75 + ((56.25 - 43.75) * (db - -24)) / (-12 - -24);
  } else {
    value = (43.75 * (db - -48)) / (-24 - -48);
  }

  return clamp(value, 0, 100);
}

// function formatDb(db: number | null | undefined): string {
//   if (db === undefined || db === null || Number.isNaN(db)) {
//     return "-inf";
//   }

//   if (db <= -96) {
//     return "-inf";
//   }

//   return db.toFixed(1);
// }

function MeterRow({ label, rms, peak }: MeterRowProps) {
  const rmsPct = dbToPercent(rms);
  const peakPct = dbToPercent(peak);
  const yellowPct = dbToPercent(-20);
  const maskWidth = 100 - rmsPct;
  const clipped = peak > 0;

  return (
    <div className="mb-1.5 flex items-center gap-2.5 text-sm">
      <span className="w-20 shrink-0 text-current/50">{label}</span>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-md ">
        <div
          className="absolute inset-0"
          style={{
            background: clipped
              ? "#ff5a4e"
              : `linear-gradient(
              to right,
              #16a085 0%,
              #16a085 ${yellowPct}%,
              #f39c12 ${yellowPct}%,
              #f39c12 100%
            )`,
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 bg-input transition-[width] duration-70 ease-linear"
          style={{
            width: `${maskWidth}%`,
          }}
        />
        <div
          className={`absolute inset-y-0 -translate-x-1/2 w-0.5 transition-[left,background-color] duration-70 ease-linear ${
            clipped ? "bg-[#ff5a4e]" : "bg-text"
          }`}
          style={{ left: `${peakPct}%` }}
        />
      </div>
      {/* <span
        className="w-13 shrink-0 text-right tabular-nums text-current/50"
        style={{
          color: clipped ? "#ff5a4e" : "",
        }}
      >
        {formatDb(peak)}
      </span> */}
    </div>
  );
}
function ScaleTicks() {
  const ticks = [-96, -72, -48, -36, -24, -18, -12, -6, 0, 6];

  return (
    <div className="mb-1 flex items-center">
      <span className="w-25 shrink-0" />

      <div className="relative h-7 flex-1 text-xs">
        {ticks.map((tick, index) => {
          const left = (index / (ticks.length - 1)) * 100;

          return (
            <span key={tick} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${left}%` }}>
              {tick > 0 ? `+${tick}` : tick}
              <span className="hidden md:inline">dB</span>
            </span>
          );
        })}

        <div className="absolute inset-x-0 top-5">
          {ticks.map((_, index) => {
            const left = (index / (ticks.length - 1)) * 100;
            return <span key={`main-${index}`} className="absolute block h-2 w-px bg-current" style={{ left: `${left}%` }} />;
          })}

          {ticks.slice(0, -1).map((_, index) => {
            const left = ((index + 0.5) / (ticks.length - 1)) * 100;
            return <span key={`minor-${index}`} className="absolute block h-1.5 w-px bg-current/30 top-0.5" style={{ left: `${left}%` }} />;
          })}
        </div>
      </div>

      <span className="w-5 shrink-0" />
    </div>
  );
}
function getLabelForChannel(labels: (string | null)[] | null, index: number): string {
  const raw = labels?.[index];
  return raw || `CH ${index}`;
}

function MeterGroup({ title, rmsArr, peakArr, labels }: MeterGroupProps) {
  if (!rmsArr || rmsArr.length === 0) {
    return null;
  }

  return (
    <>
      <div>{title}</div>
      <div className="mb-4">
        <ScaleTicks />
      </div>
      {rmsArr.map((rms, i) => (
        <MeterRow key={i} label={getLabelForChannel(labels, i)} rms={rms} peak={peakArr?.[i] ?? rms} />
      ))}
    </>
  );
}

const VuMeter = () => {
  const [result, setResult] = useState<DspResult | null>(null);

  const fetchLevels = useCallback(async (): Promise<void> => {
    try {
      const data = await fetchJsonRpc<DspResult>("dsp.signal_levels", 99);
      setResult(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchLevels();

    const interval = setInterval(() => {
      fetchLevels();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {result ? (
        <>
          <div>
            <MeterGroup
              title="Capture"
              rmsArr={result.levels.capture_rms}
              peakArr={result.levels.capture_peak}
              labels={result.labels?.capture ?? null}
            />
          </div>
          <div className="mt-10">
            <MeterGroup
              title="Playback"
              rmsArr={result.levels.playback_rms}
              peakArr={result.levels.playback_peak}
              labels={result.labels?.playback ?? null}
            />
          </div>
        </>
      ) : (
        <div className="py-2">Waiting for levels…</div>
      )}
    </>
  );
};

export default VuMeter;
