import { PROCESSOR_TYPE, PROCESSOR_TYPE_SHORT } from "../../types";

const getFilterAlphabet = (processor: any) => {
  switch (processor.type) {
    case PROCESSOR_TYPE.COMPRESSOR:
      return PROCESSOR_TYPE_SHORT.COMPRESSOR;

    case PROCESSOR_TYPE.NOISE:
      return PROCESSOR_TYPE_SHORT.NOISE;

    default:
      return "";
  }
};

const Processor = ({ name, processor, onClick }: { name: string; processor: any; onClick?: (name: string) => void }) => {
  return (
    <div className="flex items-center py-3 px-4" onClick={() => onClick && onClick(name)}>
      <div className="bg-cover text-primary rounded-md w-12 h-12 flex items-center justify-center text-xl mr-3">{getFilterAlphabet(processor)}</div>
      <div>
        {name}
        <div className="flex mt-0.5 text-secondary text-md items-center">{processor.type}</div>
      </div>
    </div>
  );
};

export default Processor;
