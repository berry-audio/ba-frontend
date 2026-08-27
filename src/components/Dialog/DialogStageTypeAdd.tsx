import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDspActions } from "@/hooks/useDspActions";
import { CheckCircleIcon, CircleIcon, ListIcon } from "@phosphor-icons/react";
import { DIALOG_EVENTS } from "@/store/constants";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import Filter from "@/views/Dsp/components/Filters/Filter";
import Mixer from "@/views/Dsp/components/Mixers/Mixer";
import ItemWrapper from "../Wrapper/ItemWrapper";
import NoItems from "../Item/NoItems";
import Modal from "../Modal";
import Processor from "@/views/Dsp/components/Processors/processor";

type DialogStageType = {
  item: {
    index: number;
    type: string;
  };
};

const DialogStageTypeAdd = ({ item }: DialogStageType) => {
  const dispatch = useDispatch();

  const { config } = useSelector((state: any) => state.dsp);
  const { addStageType, loading } = useDspActions();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const propertyName: { [key: string]: string } = {
    Mixer: "mixers",
    Processor: "processors",
    Filter: "filters",
  };
  const StageType = propertyName[item.type];
  const items = Object.entries(config[StageType] ?? {});

  return (
    <Modal
      title={`Choose ${item.type}`}
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Add"
      buttonOnClick={() => addStageType(item.index, item.type, selectedItems)}
      buttonLoading={loading}
      buttonDisabled={!selectedItems.length}
      padding
    >
      <div className="max-h-[50vh] overflow-auto">
        <div>
          {Object.entries(items).length === 0 ? (
            <NoItems title={`No ${item.type} configured`} icon={<ListIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
          ) : (
            [...items]
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([name, item]) => (
                <div key={name} className="col-span-2 md:col-span-1">
                  <ItemWrapper>
                    <div className="flex-1">
                      {StageType === "mixers" && <Mixer name={name} mixer={item} onClick={(name) => setSelectedItems([name])} />}
                      {StageType === "filters" && (
                        <Filter
                          name={name}
                          filter={item}
                          onClick={(name) =>
                            setSelectedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
                          }
                        />
                      )}
                      {StageType === "processors" && <Processor name={name} processor={item} onClick={(name) => setSelectedItems([name])} />}
                    </div>

                    <div className="pr-4">
                      {selectedItems.includes(name) ? (
                        <CheckCircleIcon weight="fill" size={ICON_SM} className="text-primary" />
                      ) : (
                        <CircleIcon size={25} className="opacity-50" />
                      )}
                    </div>
                  </ItemWrapper>
                </div>
              ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DialogStageTypeAdd;
