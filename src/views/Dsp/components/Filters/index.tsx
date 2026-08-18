import { useSelector } from "react-redux";

import Filter from "./Filter";

const Filters = () => {
  const { config } = useSelector((state: any) => state.dsp);

  const filters = Object.entries(config?.filters ?? {});

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {[...filters]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, filter]) => (
          <Filter key={key} name={key} filter={filter} />
        ))}
    </div>
  );
};

export default Filters;
