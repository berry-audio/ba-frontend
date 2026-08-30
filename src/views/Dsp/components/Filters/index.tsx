import { useSelector } from "react-redux";

import ButtonFilterAdd from "@/components/Button/ButtonFilterAdd";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ButtonFilterDelete from "@/components/Button/ButtonFilterDelete";
import Filter from "./Filter";

const Filters = () => {
  const { config } = useSelector((state: any) => state.dsp);

  const filters = Object.entries(config?.filters ?? {});

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {[...filters]
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([name, filter]) => (
            <div key={name} className="col-span-2 md:col-span-1">
              <ItemWrapper key={name}>
                <div className="flex flex-1 items-center">
                  <div className="flex-1">
                    <Filter name={name} filter={filter} />
                  </div>
                  <div className="flex mr-2">
                    <ButtonFilterDelete name={name} />
                  </div>
                </div>
              </ItemWrapper>
            </div>
          ))}
      </div>

      <div className="col-span-2 flex items-center justify-center my-5">
        <ButtonFilterAdd />
      </div>
    </>
  );
};

export default Filters;
