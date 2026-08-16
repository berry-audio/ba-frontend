import { fetchJsonRpc } from "@/util";
import { useEffect, useState } from "react";

import Filter from "./Filter";
import Equalizer from "./Equalizer";
import { FiltersType } from "../../types";

const Filters = () => {
  const [result, setResult] = useState<any>({});

  const fetchConfig = async (): Promise<void> => {
    try {
      const data = await fetchJsonRpc<FiltersType>("dsp.get_config", 102);
      setResult(data);
    } catch {}
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (!result) {
    return null;
  }

  const filters = Object.entries(result?.filters ?? {});
  const equalizer = filters.find(([, filter]: [string, any]) => filter.type === "BiquadCombo" && filter.parameters.type === "GraphicEqualizer");
  const otherFilters = filters.filter(
    ([, filter]: [string, any]) => !(filter.type === "BiquadCombo" && filter.parameters.type === "GraphicEqualizer"),
  );

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      {equalizer && (
        <div className="col-span-2">
          <Equalizer name={equalizer[0]} filter={equalizer[1]} />
        </div>
      )}

      {otherFilters.map(([key, filter]) => (
        <Filter key={key} name={key} filter={filter} />
      ))}
    </div>
  );
};

export default Filters;
