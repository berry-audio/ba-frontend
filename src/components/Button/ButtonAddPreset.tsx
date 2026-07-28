import { useState } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import { Input } from "@/components/Form/Input";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { useTunerService } from "@/services/tuner";

import Modal from "@/components/Modal";
import ButtonIcon from "@/components/Button/ButtonIcon";

const ButtonAddPreset = () => {
  const { getChannel, presetAdd } = useTunerService();

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [presetName, setPresetName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onClickShowModal = async () => {
    const current_channel = await getChannel();
    setPresetName(`FM #${current_channel}`);
    setShowCreateModal(true);
  };

  const onClickCreateHandler = async () => {
    setLoading(true);
    try {
      const current_channel = await getChannel();
      await presetAdd(current_channel, presetName);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    setShowCreateModal(false);
  };

  return (
    <>
      <ButtonIcon onClick={onClickShowModal}>
        <PlusIcon weight={ICON_WEIGHT} size={ICON_SM} />
      </ButtonIcon>

      <Modal
        title="Add Preset"
        onClose={() => setShowCreateModal(false)}
        isOpen={showCreateModal}
        buttonText="Save"
        buttonLoading={loading}
        buttonOnClick={onClickCreateHandler}
        buttonDisabled={presetName === ""}
      >
        <div className="py-2">
          <Input
            type="text"
            placeholder="Preset Name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onClickClear={() => setPresetName("")}
          />
        </div>
      </Modal>
    </>
  );
};

export default ButtonAddPreset;
