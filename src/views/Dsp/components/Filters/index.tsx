import { useState } from "react";
import { useSelector } from "react-redux";
import { TrashIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ButtonAddFilter from "@/components/Button/ButtonAddFilter";
import useDspActions from "@/hooks/useDspActions";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ButtonIcon from "@/components/Button/ButtonIcon";
import Modal from "@/components/Modal";
import Filter from "./Filter";

const Filters = () => {
  const { config } = useSelector((state: any) => state.dsp);
  const { deleteFilter, loading } = useDspActions();

  const [deleteDialog, setDeleteDialog] = useState<boolean | string>(false);
  const filters = Object.entries(config?.filters ?? {});

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {[...filters]
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([name, filter]) => (
            <div key={name} className="col-span-2 md:col-span-1 ">
              <ItemWrapper key={name}>
                <div className="flex-1">
                  <Filter name={name} filter={filter} />
                </div>
                <div className="flex">
                  <ButtonIcon onClick={() => setDeleteDialog(name)}>
                    <TrashIcon weight={ICON_WEIGHT} size={ICON_SM} />
                  </ButtonIcon>
                </div>
              </ItemWrapper>
            </div>
          ))}
      </div>

      <div className="col-span-2 flex items-center justify-center mt-8">
        <ButtonAddFilter />
      </div>

      <Modal
        title="Delete filter"
        onClose={() => setDeleteDialog(false)}
        isOpen={!!deleteDialog}
        buttonLoading={loading}
        buttonText={"Delete"}
        buttonOnClick={() => deleteFilter(deleteDialog as string)}
      >
        <div className="py-2 text-secondary">
          Are you sure you want to delete the <span className="text-primary">{deleteDialog}</span> filter ? This will also remove the filter from the
          pipeline.
        </div>
      </Modal>
    </>
  );
};

export default Filters;
