import { useSelector } from "react-redux";

import Stage from "./Stage";
import ButtonAddStage from "@/components/Button/ButtonAddStage";

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

  console.log(pipeline)

  return (
    <>
      <div className="">
        {pipeline.map((stage, key) => (
          <Stage key={key} stage={stage} config={config} index={key} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-8">
        <ButtonAddStage />
      </div>
    </>
  );
};

export default Pipeline;
