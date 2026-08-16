import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { GearIcon, TrashIcon } from "@phosphor-icons/react";
import { Checkbox } from "@/components/ui/checkbox";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import Gain from "./Gain";
import Modal from "@/components/Modal";
import ButtonIcon from "@/components/Button/ButtonIcon";
import useDspActions from "@/hooks/useDspActions";
import Pitch from "./Pitch";

export interface FilterProps {
  name: string;
  filter: any;
}

export interface FilterHeaderProps {
  name: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const FilterHeader = ({ name, description, onEdit, onDelete }: FilterHeaderProps) => {
  return (
    <div className="mb-2 flex justify-between">
      <div>
        {name}
        <div className="text-secondary text-md">{description}</div>
      </div>
      <div className="flex">
        <ButtonIcon onClick={onEdit}>
          <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />
        </ButtonIcon>
        <ButtonIcon onClick={onDelete}>
          <TrashIcon weight={ICON_WEIGHT} size={ICON_SM} />
        </ButtonIcon>
      </div>
    </div>
  );
};

const Filter = ({ name, filter }: FilterProps) => {
  const { saveFilter, loading } = useDspActions();

  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);

  const formRef = useRef<UseFormReturn<any>>(null);
  const handleSave = () => formRef.current?.handleSubmit((values) => saveFilter(name, { ...values, description: values.description || null }))();

  return (
    <>
      <div className="col-span-2 md:col-span-1">
        <FilterHeader name={name} description={filter.type} onEdit={() => setEditDialog(true)} onDelete={() => setDeleteDialog(true)} />
        <Modal
          title={name}
          onClose={() => setEditDialog(false)}
          isOpen={editDialog}
          buttonText="Save"
          buttonOnClick={handleSave}
          buttonLoading={loading}
        >
          {filter.type === "Gain" && <Gain ref={formRef} filter={filter} onRelease={autoUpdate && handleSave} />}
          {filter.type === "Pitch" && <Pitch ref={formRef} filter={filter} onRelease={autoUpdate && handleSave} />}

          <div className="flex items-center mt-7">
            <Checkbox value={autoUpdate} onChange={setAutoUpdate} />
            <label className="cursor-pointer ml-2" onClick={() => setAutoUpdate(!autoUpdate)}>
              Save automatically
            </label>
          </div>
        </Modal>
      </div>

      <Modal title="Delete filter" onClose={() => setDeleteDialog(false)} isOpen={deleteDialog} buttonText={"Delete"} buttonOnClick={undefined}>
        <div className="py-2 text-secondary">
          Are you sure you want to delete the <span className="text-primary">{name}</span> filter ?
        </div>
      </Modal>
    </>
  );
};

export default Filter;
