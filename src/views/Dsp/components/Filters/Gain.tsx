import { forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { Slider } from "@/components/Form/Slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FILTER_TYPE } from "../../types";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import SelectComboBox from "@/components/Form/SelectComboBox";

const OPTIONS_SCALE = [
  { value: "linear", label: "Linear" },
  { value: "dB", label: "dB" },
];

const OPTIONS_INVERTED = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const OPTIONS_MUTE = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

export type GainFilterType = {
  type: FILTER_TYPE.GAIN;
  name: string;
  description: string | null;
  parameters: {
    gain: number;
    inverted: boolean;
    mute: boolean;
    scale: string;
  };
};

export const defaultGainValues: GainFilterType = {
  type: FILTER_TYPE.GAIN,
  name: "",
  description: null,
  parameters: {
    gain: 0,
    inverted: false,
    mute: false,
    scale: "dB",
  },
};

const Gain = forwardRef<UseFormReturn<GainFilterType>, { filter: GainFilterType; onRelease?: any }>(({ filter, onRelease }, ref) => {
  const {
    config: { filters },
  } = useSelector((state: any) => state.dsp);

  const formSchema = z.object({
    type: z.literal(FILTER_TYPE.GAIN),
    name: z
      .string()
      .min(1, "Name is required")
      .refine((name) => name === filter?.name || !Object.keys(filters ?? {}).includes(name), { message: "A filter with this name already exists" }),
    description: z.string().nullable(),
    parameters: z.object({
      gain: z.number(),
      inverted: z.boolean(),
      mute: z.boolean(),
      scale: z.string(),
    }),
  });

  const form = useForm<GainFilterType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      ...defaultGainValues,
      ...filter,
      parameters: {
        ...defaultGainValues.parameters,
        ...filter?.parameters,
      },
    },
  });

  useImperativeHandle(ref, () => form, [form]);

  return (
    <Form {...form}>
      <div className="grid grid-cols-2 gap-5">
        {filter?.name === "" && (
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-base">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      onChange={(value) => {
                        field.onChange(value);
                        onRelease();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="col-span-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-base">Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Description"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(value) => {
                      field.onChange(value);
                      onRelease();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-2 my-2">
          <FormField
            control={form.control}
            name="parameters.gain"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Gain (dB)</FormLabel>
                <FormControl>
                  <Slider
                    showTicks
                    showLabels
                    tickInterval={25}
                    unit={""}
                    value={[field.value]}
                    max={100}
                    min={-100}
                    step={1}
                    className="w-full rounded-full"
                    onValueChange={(value) => field.onChange(value[0])}
                    onValueCommit={onRelease}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-2">
          <FormField
            control={form.control}
            name="parameters.scale"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Scale</FormLabel>
                <FormControl>
                  <SelectComboBox
                    items={OPTIONS_SCALE}
                    {...field}
                    onChange={(value) => {
                      field.onChange(value);
                      onRelease();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-1">
          <FormField
            control={form.control}
            name="parameters.inverted"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Inverted</FormLabel>
                <FormControl>
                  <SelectComboBox
                    items={OPTIONS_INVERTED}
                    {...field}
                    onChange={(value) => {
                      field.onChange(value);
                      onRelease();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-1">
          <FormField
            control={form.control}
            name="parameters.mute"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Mute</FormLabel>
                <FormControl>
                  <SelectComboBox
                    items={OPTIONS_MUTE}
                    {...field}
                    onChange={(value) => {
                      field.onChange(value);
                      onRelease();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
});

export default Gain;
