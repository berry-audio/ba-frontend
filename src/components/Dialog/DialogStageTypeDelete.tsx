import { useDispatch } from "react-redux";
import { useDspActions } from "@/hooks/useDspActions";
import { DIALOG_EVENTS } from "@/store/constants";

import Modal from "../Modal";

type DialogStageType = {
  item: {
    stageIndex: number;
    stageType: string;
    typeIndex: number;
    typeName: string;
  };
};

const DialogStageTypeDelete = ({ item }: DialogStageType) => {
  const dispatch = useDispatch();

  const { deleteStageType } = useDspActions();

  return (
    <Modal
      title={`Delete ${item.stageType}`}
      onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })}
      isOpen={true}
      buttonText="Delete"
      buttonLoading={false}
      buttonOnClick={() => deleteStageType(item.stageIndex, item.stageType, item.typeIndex, item.typeName)}
    >
      <span className="text-secondary">
        Are you sure you want to delete <b>{item.typeName}</b>?
      </span>
    </Modal>
  );
};

export default DialogStageTypeDelete;
