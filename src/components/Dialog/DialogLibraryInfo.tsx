import { useDispatch } from "react-redux";
import { DIALOG_EVENTS } from "@/store/constants";
import { Artist } from "@/types";

import Modal from "@/components/Modal";

const DialogLibraryInfo = ({ item }: { item: Artist }) => {
  const dispatch = useDispatch();

  return (
    <Modal title={item.name} onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })} isOpen={true} buttonShow={false} zindexOverlay={100}>
      <span className="text-secondary">{item.biography ? item.biography : "No information available"}</span>
    </Modal>
  );
};

export default DialogLibraryInfo;
