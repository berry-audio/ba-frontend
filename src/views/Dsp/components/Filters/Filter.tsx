import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { GearIcon, TrashIcon } from "@phosphor-icons/react";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterParameterType, FilterTypeNames, FilterTypeNameShort } from "../../types";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import Gain from "./Gain";
import Modal from "@/components/Modal";
import ButtonIcon from "@/components/Button/ButtonIcon";
import useDspActions from "@/hooks/useDspActions";
import Pitch from "./Pitch";
import Reverb from "./Reverb";
import Flanger from "./Flanger";
import Biquad from "./Biquad";
import BiquadCombo from "./BiquadCombo";

export interface FilterProps {
  name: string;
  filter: any;
}

export interface FilterHeaderProps {
  name: string;
  filter: any;
  onEdit: () => void;
  onDelete: () => void;
}

const getFilterAlphabet = (filter: any) => {
  switch (filter.type) {
    case FilterTypeNames.GAIN:
      return FilterTypeNameShort.GAIN;

    case FilterTypeNames.FLANGER:
      return FilterTypeNameShort.FLANGER;

    case FilterTypeNames.REVERB:
      return FilterTypeNameShort.REVERB;

    case FilterTypeNames.PITCH:
      return FilterTypeNameShort.PITCH;

    case FilterTypeNames.BIQUAD:
      return FilterTypeNameShort.BIQUAD;

    case FilterTypeNames.BIQUAD_COMBO:
      return filter.parameters?.type === FilterParameterType.GRAPHIC_EQUALIZER
        ? FilterTypeNameShort.GRAPHIC_EQUALIZER
        : FilterTypeNameShort.BIQUAD_COMBO;

    default:
      return "";
  }
};

export const FilterHeader = ({ name, filter, onEdit, onDelete }: FilterHeaderProps) => {
  return (
    <div className="mb-2 flex justify-between">
      <div className="flex items-center">
        <div className="bg-foreground text-primary rounded-md w-12 h-12 flex items-center justify-center text-xl mr-3">
          {getFilterAlphabet(filter)}
        </div>
        <div>
          {name}
          <div className="text-secondary text-md">{filter.type}</div>
        </div>
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
  const [autoUpdate, setAutoUpdate] = useState<boolean>(false);

  const isGraphicEqualizer = filter.type === "BiquadCombo" && filter.parameters.type === "GraphicEqualizer";

  const formRef = useRef<UseFormReturn<any>>(null);
  const handleSave = () => formRef.current?.handleSubmit((values) => saveFilter(name, { ...values, description: values.description || null }))();
  const handleOnRelease = () => autoUpdate && handleSave();

  return (
    <>
      <div className="col-span-2 md:col-span-1 ">
        <FilterHeader name={name} filter={filter} onEdit={() => setEditDialog(true)} onDelete={() => setDeleteDialog(true)} />
        <Modal
          title={name}
          onClose={() => setEditDialog(false)}
          isOpen={editDialog}
          buttonText="Save"
          buttonOnClick={handleSave}
          buttonLoading={loading}
          size={isGraphicEqualizer ? "w-200" : "w-125"}
        >
          {filter.type === "Gain" && <Gain ref={formRef} filter={filter} onRelease={handleOnRelease} />}
          {filter.type === "Pitch" && <Pitch ref={formRef} filter={filter} onRelease={handleOnRelease} />}
          {filter.type === "Reverb" && <Reverb ref={formRef} filter={filter} onRelease={handleOnRelease} />}
          {filter.type === "Biquad" && <Biquad ref={formRef} filter={filter} onRelease={handleOnRelease} />}
          {filter.type === "Flanger" && <Flanger ref={formRef} filter={filter} onRelease={handleOnRelease} />}
          {filter.type === "BiquadCombo" && <BiquadCombo ref={formRef} filter={filter} onRelease={handleOnRelease} />}

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
