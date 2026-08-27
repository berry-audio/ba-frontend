import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useChannelValidation, useDspActions } from "@/hooks/useDspActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TrashIcon } from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DIALOG_EVENTS } from "@/store/constants";
import { STAGE_TYPE } from "../../types";
import { calculateChannels } from "@/util";
import { z } from "zod";

import Mixer, { DisplayChannel } from "../Mixers/Mixer";
import SelectComboBox from "@/components/Form/SelectComboBox";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import Filter from "../Filters/Filter";
import Button from "@/components/Button";
import ButtonStageAddType from "@/components/Button/ButtonStageAddType";
import ButtonStageDelete from "@/components/Button/ButtonStageDelete";
import ButtonStageChannels from "@/components/Button/ButtonStageChannels";
import Processor from "../Processors/processor";

const OPTIONS_TYPE = [
  { value: STAGE_TYPE.MIXER, label: STAGE_TYPE.MIXER },
  { value: STAGE_TYPE.PROCESSOR, label: STAGE_TYPE.PROCESSOR },
  { value: STAGE_TYPE.FILTER, label: STAGE_TYPE.FILTER },
];

const ListItemMixer = ({ stageIndex, stageType, typeName, config }: { stageIndex: number; stageType: string; typeName: string; config: any }) => {
  const dispatch = useDispatch();
  const mixers = config?.mixers;
  const mixer = mixers[typeName];
  const channelsInMixer = mixer.channels.in;
  const channelsOutMixer = mixer.channels.out;

  const { channelsInAllowed, channelsInMatch, channelsOutAllowed, channelsOutMatch } = useChannelValidation(
    config,
    stageIndex,
    STAGE_TYPE.MIXER,
    typeName,
  );

  return (
    <>
      <ItemWrapper>
        <div className="flex-1">
          <Mixer name={typeName} mixer={mixer} />
        </div>
        <div className="flex">
          <Button
            type="ghost"
            onClick={() => dispatch({ type: DIALOG_EVENTS.DIALOG_DSP_STAGE_DELETE_TYPE, payload: { stageIndex, stageType, typeName } })}
            className="w-auto"
          >
            <TrashIcon weight={ICON_WEIGHT} size={ICON_SM} />
          </Button>
        </div>
      </ItemWrapper>

      {!channelsInMatch && (
        <div className="bg-primary rounded-md relative px-3 py-2 text-md mt-2">
          Mixer has wrong number of input channels. Expected {channelsInAllowed}, found {channelsInMixer}
        </div>
      )}

      {!channelsOutMatch && (
        <div className="bg-primary rounded-md relative px-3 py-2 text-md mt-2">
          Mixer has wrong number of output channels. Playback has {channelsOutAllowed}, found {channelsOutMixer}
        </div>
      )}
    </>
  );
};
const ListItemProcessor = ({ stageIndex, stageType, typeName, config }: { stageIndex: number; stageType: string; typeName: string; config: any }) => {
  const dispatch = useDispatch();
  const processor = config?.processors?.[typeName];
  const channelsInProcessor = processor.parameters.channels;

  const { channelsInAllowed, channelsInMatch, channelsOutAllowed, channelsOutMatch } = useChannelValidation(
    config,
    stageIndex,
    channelsInProcessor,
    channelsInProcessor,
  );

  return (
    <>
      <ItemWrapper>
        <div className="flex-1">
          <Processor name={typeName} processor={processor} />
        </div>
        <div className="flex">
          <Button
            type="ghost"
            onClick={() =>
              dispatch({
                type: DIALOG_EVENTS.DIALOG_DSP_STAGE_DELETE_TYPE,
                payload: { stageIndex, stageType, typeName },
              })
            }
            className="w-auto"
          >
            <TrashIcon weight={ICON_WEIGHT} size={ICON_SM} />
          </Button>
        </div>
      </ItemWrapper>

      {!channelsInMatch && (
        <div className="bg-primary rounded-md relative px-3 py-2 text-md mt-2">
          Processor has wrong number of input channels. Expected {channelsInProcessor}, found {channelsInAllowed}
        </div>
      )}

      {!channelsOutMatch && (
        <div className="bg-primary rounded-md relative px-3 py-2 text-md mt-2">
          Processor has wrong number of output channels. Playback has {channelsOutAllowed}, found {channelsInProcessor}
        </div>
      )}
    </>
  );
};

const ListItemFilter = ({
  stageIndex,
  stageType,
  typeIndex,
  typeName,
  config,
}: {
  stageIndex: number;
  stageType: string;
  typeIndex: number;
  typeName: string;
  config: any;
}) => {
  const dispatch = useDispatch();
  const filters = config?.filters;
  const filter = filters[typeName];

  return (
    <ItemWrapper key={typeIndex}>
      <div className="flex-1">
        <Filter name={typeName} filter={filter} />
      </div>
      <div className="flex">
        <Button
          type="ghost"
          onClick={() => dispatch({ type: DIALOG_EVENTS.DIALOG_DSP_STAGE_DELETE_TYPE, payload: { stageIndex, stageType, typeIndex, typeName } })}
          className="w-auto"
        >
          <TrashIcon weight={ICON_WEIGHT} size={ICON_SM} />
        </Button>
      </div>
    </ItemWrapper>
  );
};

const Stage = ({ stage, config, index }: { stage: any; config: any; index: number }) => {
  const { changeStage, bypassStage } = useDspActions();
  const [selectedType, setSelectedType] = useState<string>(stage.type);
  const channelsCount = calculateChannels(config, index);

  const formSchema = z.object({
    bypassed: z.boolean(),
    channels: z.number().array(),
    description: z.string().nullable(),
    name: z.string(),
    names: z.string().array(),
    type: z.string(),
  });

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      bypassed: !stage.bypassed,
      type: stage.type,
    },
  });

  useEffect(() => {
    form.setValue("bypassed", !stage.bypassed);
  }, [stage]);

  return (
    <div className="bg-dialog rounded-md w-full mb-4 py-5 shadow-sm">
      <Form {...form}>
        <form className="">
          <div className="flex justify-between md:mb-2 border-b border-neutral-200 dark:border-neutral-800 pb-5 px-4">
            <div className="flex items-center">
              <div className="w-50 mr-3">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectComboBox
                          items={OPTIONS_TYPE}
                          {...field}
                          onChange={async (value) => {
                            field.onChange(value);
                            setSelectedType(value);
                            await changeStage(index, value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>{stage.type !== STAGE_TYPE.MIXER && <DisplayChannel text="IN" count={channelsCount} />}</div>
            </div>
            <div className="flex justify-end items-center w-100">
              <div className="mr-3">
                <ButtonStageChannels index={index} type={stage.type} channels={stage.channels} />
              </div>

              <FormField
                control={form.control}
                name="bypassed"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        {...field}
                        onChange={async (value) => {
                          field.onChange(value);
                          await bypassStage(index, !value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="ml-3">
                <ButtonStageDelete index={index} type={stage.type} />
              </div>
            </div>
          </div>
        </form>

        <div className="px-0 md:px-4">
          {selectedType === STAGE_TYPE.MIXER &&
            (stage.name ? (
              <ListItemMixer stageIndex={index} stageType={stage.type} typeName={stage.name} config={config} />
            ) : (
              <div className="col-span-2 justify-self-start mt-4">
                <ButtonStageAddType index={index} type={stage.type} />
              </div>
            ))}

          {selectedType === STAGE_TYPE.PROCESSOR &&
            (stage.name ? (
              <ListItemProcessor stageIndex={index} stageType={stage.type} typeName={stage.name} config={config} />
            ) : (
              <div className="col-span-2 justify-self-start mt-4">
                <ButtonStageAddType index={index} type={stage.type} />
              </div>
            ))}

          {selectedType === STAGE_TYPE.FILTER && (
            <>
              {stage.names.map((filterName: string, key: number) => (
                <div key={`${filterName}-${key}`} className="col-span-2">
                  <ListItemFilter stageIndex={index} stageType={stage.type} typeIndex={key} typeName={filterName} config={config} />
                </div>
              ))}

              <div className="col-span-2 justify-self-start mt-4">
                <ButtonStageAddType index={index} type={stage.type} />
              </div>
            </>
          )}
        </div>
      </Form>
    </div>
  );
};

export default Stage;
