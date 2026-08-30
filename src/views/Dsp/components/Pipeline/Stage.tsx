import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDspActions } from "@/hooks/useDspActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { DragDropContext, Draggable, DraggableProvidedDragHandleProps, Droppable } from "@hello-pangea/dnd";
import { DotsSixVerticalIcon, TrashIcon } from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DIALOG_EVENTS } from "@/store/constants";
import { STAGE_TYPE } from "../../types";
import { calculateInChannels, calculateOutChannels } from "@/util";
import { z } from "zod";

import Mixer, { DisplayChannel } from "../Mixers/Mixer";
import SelectComboBox from "@/components/Form/SelectComboBox";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import Button from "@/components/Button";
import ButtonStageAddType from "@/components/Button/ButtonStageAddType";
import ButtonStageDelete from "@/components/Button/ButtonStageDelete";
import ButtonStageChannels from "@/components/Button/ButtonStageChannels";
import Filter from "../Filters/Filter";
import Processor from "../Processors/Processor";
import ButtonIcon from "@/components/Button/ButtonIcon";

const OPTIONS_TYPE = [
  { value: STAGE_TYPE.MIXER, label: STAGE_TYPE.MIXER },
  { value: STAGE_TYPE.PROCESSOR, label: STAGE_TYPE.PROCESSOR },
  { value: STAGE_TYPE.FILTER, label: STAGE_TYPE.FILTER },
];

const ListItemMixer = ({ stageIndex, stageType, typeName }: { stageIndex: number; stageType: string; typeName: string }) => {
  if (stageType !== STAGE_TYPE.MIXER) return;
  if (typeName === "") return;

  const { config } = useSelector((state: any) => state.dsp);

  const dispatch = useDispatch();
  const mixers = config?.mixers;
  const mixer = mixers[typeName];

  const channelsInMixer = mixer.channels.in ?? 0;
  const channelsOutMixer = mixer.channels.out ?? 0;

  const channelsInAllowed = calculateInChannels(config, stageIndex);
  const channelsOutAllowed = calculateOutChannels(config, stageIndex);

  const channelsInMatch = channelsInMixer === channelsInAllowed;
  const channelsOutMatch = channelsOutMixer === channelsOutAllowed;

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
          Mixer has wrong number of output channels. Expected {channelsOutAllowed}, found {channelsOutMixer}
        </div>
      )}
    </>
  );
};
const ListItemProcessor = ({ stageIndex, stageType, typeName }: { stageIndex: number; stageType: string; typeName: string }) => {
  if (stageType !== STAGE_TYPE.PROCESSOR) return;
  const { config } = useSelector((state: any) => state.dsp);

  const dispatch = useDispatch();
  const processor = config?.processors?.[typeName];
  const channelsInProcessor = processor.parameters.channels;
  const channelsInAllowed = calculateInChannels(config, stageIndex);
  const channelsOutAllowed = calculateOutChannels(config, stageIndex);

  const channelsInMatch = channelsInProcessor === channelsInAllowed;
  const channelsOutMatch = channelsInProcessor === channelsOutAllowed;

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
          Processor has wrong number of output channels. Expected {channelsOutAllowed}, found {channelsInProcessor}
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
}: {
  stageIndex: number;
  stageType: string;
  typeIndex: number;
  typeName: string;
}) => {
  if (stageType !== STAGE_TYPE.FILTER) return;

  const { config } = useSelector((state: any) => state.dsp);
  const dispatch = useDispatch();
  const filters = config?.filters;
  const filter = filters[typeName];

  return (
    <div key={typeIndex} className="flex flex-1">
      <div className="flex-1">
        <Filter name={typeName} filter={filter} />
      </div>
      <div className="flex items-center pr-1">
        <ButtonIcon
          onClick={() => dispatch({ type: DIALOG_EVENTS.DIALOG_DSP_STAGE_DELETE_TYPE, payload: { stageIndex, stageType, typeIndex, typeName } })}
        >
          <TrashIcon weight={ICON_WEIGHT} size={ICON_SM} />
        </ButtonIcon>
      </div>
    </div>
  );
};

export const allowStageChange = (stage: any) => {
  if (stage.type === STAGE_TYPE.MIXER || stage.type === STAGE_TYPE.PROCESSOR) {
    if (stage.name !== null) {
      return true;
    }
  }

  if (stage.type === STAGE_TYPE.FILTER) {
    if (stage.names.length > 0) {
      return true;
    }
  }

  return false;
};

const Stage = ({
  index,
  stage,
  channelsCount,
  dragHandleProps,
}: {
  index: number;
  stage: any;
  channelsCount: number;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}) => {
  const { changeStage, bypassStage, moveStageType } = useDspActions();

  const [stageNames, setStageNames] = useState<string[]>(stage?.names ?? []);

  useEffect(() => {
    form.reset({
      ...stage,
    });
    setStageNames(stage.names);
  }, [stage]);

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
  });

  const onBypassChange = async (value: boolean) => {
    if (allowStageChange(stage)) {
      await bypassStage(index, value);
      return;
    }
    form.setValue("bypassed", true);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const names = [...stageNames];
    const [moved] = names.splice(source.index, 1);
    names.splice(destination.index, 0, moved);
    setStageNames(names);

    await moveStageType(index, names);
  };

  return (
    <div className="bg-secondary w-full mb-4 py-5 shadow-sm lg:rounded-md">
      <Form {...form}>
        <div {...dragHandleProps} className="flex justify-between md:mb-2 border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <div className="flex items-center">
            <DotsSixVerticalIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2 ml-2" />
            <div className="w-32 mr-2">
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
                          await changeStage(index, value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="hidden md:block">{stage.type !== STAGE_TYPE.MIXER && <DisplayChannel text="IN" count={channelsCount} />}</div>
          </div>
          <div className="flex justify-end items-center w-100 ">
            <div className="mr-3">
              <ButtonStageChannels index={index} />
            </div>

            <FormField
              control={form.control}
              name="bypassed"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch {...field} inverted onChange={onBypassChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="ml-3 mr-4">
              <ButtonStageDelete index={index} type={stage.type} />
            </div>
          </div>
        </div>

        <div className="px-0 md:px-3">
          {form.getValues("type") === STAGE_TYPE.MIXER &&
            (stage.name !== "" ? (
              <ListItemMixer stageIndex={index} stageType={stage.type} typeName={stage.name} />
            ) : (
              <div className="col-span-2 justify-self-start mt-4">
                <ButtonStageAddType index={index} type={stage.type} />
              </div>
            ))}

          {form.getValues("type") === STAGE_TYPE.PROCESSOR &&
            (stage.name ? (
              <ListItemProcessor stageIndex={index} stageType={stage.type} typeName={stage.name} />
            ) : (
              <div className="col-span-2 justify-self-start mt-4">
                <ButtonStageAddType index={index} type={stage.type} />
              </div>
            ))}

          {form.getValues("type") === STAGE_TYPE.FILTER && (
            <>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {stageNames?.length > 0 &&
                        stageNames.map((filterName: string, key: number) => (
                          <Draggable key={key} draggableId={`${key}`} index={key}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`overflow-hidden md:overflow-visible ${snapshot.isDragging ? "rounded-md" : ""}`}
                              >
                                <ItemWrapper key={key}>
                                  <div className="flex-1 flex items-center">
                                    <DotsSixVerticalIcon weight={ICON_WEIGHT} size={ICON_SM} className="ml-2 -mr-2" />
                                    <ListItemFilter stageIndex={index} stageType={stage.type} typeIndex={key} typeName={filterName} />
                                  </div>
                                </ItemWrapper>
                              </div>
                            )}
                          </Draggable>
                        ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

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
