import { useSelector } from "react-redux";

import Stage from "./Stage";
import ButtonStageAdd from "@/components/Button/ButtonStageAdd";
import { DisplayChannel } from "../Mixers/Mixer";

interface PipelineStep {
  id: string;
  type: string;
}

interface DspState {
  dsp: {
    config?: {
      pipeline?: PipelineStep[];
    };
  };
}

const Pipeline = () => {
  const { config } = useSelector((state: DspState) => state.dsp);

  const pipeline = config?.pipeline ?? [];

  return (
    <>
      <div className="bg-dialog rounded-md w-full mb-4 py-5 px-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center min-w-0">
            <div className="bg-cover text-primary rounded-md w-12 h-12 flex items-center justify-center text-xl mr-3 shrink-0">IN</div>
            <div className="min-w-0">
              Capture Device
              <div className="text-secondary text-md truncate pr-10">{config?.devices.capture.device}</div>
            </div>
          </div>

          <DisplayChannel text="OUT" count={config?.devices.capture.channels} />
        </div>
      </div>
      <div className="">
        {pipeline.map((stage, key) => (
          <Stage key={key} index={key} config={config} stage={stage} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-8">
        <ButtonStageAdd />
      </div>
    </>
  );
};

export default Pipeline;
