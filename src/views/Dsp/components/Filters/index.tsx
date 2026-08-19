import { useSelector } from "react-redux";

import Filter from "./Filter";
import ButtonAddFilter from "@/components/Button/ButtonAddFilter";

const Filters = () => {
  const { config } = useSelector((state: any) => state.dsp);

  const filters = Object.entries(config?.filters ?? {});

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[...filters]
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([key, filter]) => (
            <Filter key={key} name={key} filter={filter} />
          ))}
      </div>

      <div className="col-span-2 flex items-center justify-center mt-8">
        <ButtonAddFilter />
      </div>
    </>
  );
};

export default Filters;
