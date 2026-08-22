import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { TrashIcon } from "@phosphor-icons/react";
import { z } from "zod";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import SelectComboBox from "@/components/Form/SelectComboBox";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ButtonIcon from "@/components/Button/ButtonIcon";
import Filter from "../Filters/Filter";
import useDspActions from "@/hooks/useDspActions";

const OPTIONS_TYPE = [
  { value: "Filter", label: "Filter" },
//   { value: "Processor", label: "Processor" },
  { value: "Mixer", label: "Mixer" },
];

const MixerByName = ({ name, config }: { name: string; config: any }) => {
  const mixers = config?.mixers;
  const mixer = mixers[name];

  return (
    <>
      {name} {mixer.channels.in} , {mixer.channels.out}
    </>
  );
};

const FilterByName = ({ name, config }: { name: string; config: any }) => {
  const filters = config?.filters;
  const filter = filters[name];

  return (
    <ItemWrapper key={name}>
      <div className="flex-1">
        <Filter name={name} filter={filter} />
      </div>
      <div className="flex pr-2">
        <ButtonIcon onClick={undefined}>
          <TrashIcon weight={ICON_WEIGHT} size={ICON_SM} />
        </ButtonIcon>
      </div>
    </ItemWrapper>
  );
};

const Stage = ({ stage, config, index }: { stage: any; config: any; index: number }) => {
  const { saveStage, loading } = useDspActions();

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
    const updatedConfig = (config.pipeline ?? []).map((stage, i) => (i === index ? { ...stage, ...values, bypassed: !values.bypassed } : stage));
    await saveStage(updatedConfig);
  };

  return (
    <div className="bg-dialog rounded-md w-full mb-4 py-5 px-4 shadow-sm">
      <Form {...form}>
        <form onChange={handleFormChange} className="grid grid-cols-2">
          <div className="col-span-1 mb-2">
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
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 mb-2 flex justify-end items-center">
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
          </div>

          {stage.type === "Mixer" && (
            <div>
              <MixerByName name={stage.name} config={config} />
            </div>
          )}

          {stage.type === "Filter" &&
            stage.names.map((filterName: string, key: number) => (
              <div key={key} className="col-span-2">
                <FilterByName name={filterName} config={config} />
              </div>
            ))}
        </form>
      </Form>
    </div>
  );
};

export default Stage;
