import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TrashIcon } from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { DIALOG_EVENTS } from "@/store/constants";
import { z } from "zod";

import SelectComboBox from "@/components/Form/SelectComboBox";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import Filter from "../Filters/Filter";
import useDspActions from "@/hooks/useDspActions";
import Button from "@/components/Button";
import ButtonStageAddType from "@/components/Button/ButtonStageAddType";
import ButtonStageDelete from "@/components/Button/ButtonStageDelete";

const OPTIONS_TYPE = [
  { value: "Filter", label: "Filter" },
  { value: "Processor", label: "Processor" },
  { value: "Mixer", label: "Mixer" },
];

const ListItemMixer = ({ name, config }: { name: string; config: any }) => {
  const mixers = config?.mixers;
  const mixer = mixers[name];

  return (
    <>
      {name} {mixer.channels.in} , {mixer.channels.out}
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
  const { saveStage } = useDspActions();
  const [selectedType, setSelectedType] = useState<string>(stage.type);

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

  const handleFormChange = async () => {
    const values = form.getValues();
    const updatedConfig = (config.pipeline ?? []).map((stage: any, i: number) =>
      i === index ? { ...stage, ...values, bypassed: !values.bypassed } : stage,
    );
    await saveStage(updatedConfig);
  };

  return (
    <div className="bg-dialog rounded-md w-full mb-4 py-5 shadow-sm">
      <Form {...form}>
        <form onChange={handleFormChange} className="">
          <div className="flex justify-between md:mb-2 border-b border-neutral-200 dark:border-neutral-800 pb-5 px-4">
            <div className="w-50">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectComboBox
                        items={OPTIONS_TYPE}
                        {...field}
                        onChange={(value) => {
                          field.onChange(value);
                          setSelectedType(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end items-center w-100">
              <FormField
                control={form.control}
                name="bypassed"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch {...field} />
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
          {selectedType === "Mixer" && (
            <div>
              <ListItemMixer name={stage.name} config={config} />
            </div>
          )}

          {selectedType === "Filter" && (
            <>
              {stage.names.map((filterName: string, key: number) => (
                <div key={key} className="col-span-2">
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
