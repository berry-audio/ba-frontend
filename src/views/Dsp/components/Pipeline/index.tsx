import { useSelector } from "react-redux";

import Stage from "./Stage";
import ButtonStageAdd from "@/components/Button/ButtonStageAdd";

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
