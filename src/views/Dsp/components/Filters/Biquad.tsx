import { forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { Slider } from "@/components/Form/Slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputNumber } from "@/components/Form/InputNumber";
import { FilterTypeNames } from "../../types";
import { z } from "zod";

import SelectComboBox from "@/components/Form/SelectComboBox";

const OPTIONS_SUBTYPE = [
  { value: "Lowpass", label: "Lowpass : 2nd order lowpass" },
  { value: "Highpass", label: "Highpass : 2nd order highpass" },
  { value: "Lowshelf", label: "Lowshelf : 2nd order lowshelf" },
  { value: "Highshelf", label: "Highshelf : 2nd order high shelf" },
  { value: "LowpassFO", label: "LowpassFO : 1st order lowpass" },
  { value: "HighpassFO", label: "HighpassFO : 1st order highpass" },
  { value: "LowshelfFO", label: "LowshelfFO : 1st order lowshelf" },
  { value: "HighshelfFO", label: "HighshelfFO : 1st order high shelf" },
  { value: "Peaking", label: "Peaking : 2nd order peaking" },
  { value: "Notch", label: "Notch : 2nd order notch" },
  { value: "GeneralNotch", label: "GeneralNotch : 2nd order general notch" },
  { value: "Bandpass", label: "Bandpass : 2nd order bandpass" },
  { value: "Allpass", label: "Allpass : 2nd order allpass" },
  { value: "AllpassFO", label: "AllpassFO : 1st order allpass" },
  { value: "LinkwitzTransform", label: "LinkwitzTransform : Linkwitz Transform" },
  { value: "Free", label: "Free : Biquad coefficients" },
];

export type BiquadFilterType = {
  type: FilterTypeNames.BIQUAD;
  name: string;
  description: string | null;
  parameters: {
    type: string;
    freq: number;
    q: number;
    gain: number;
  };
};

export const defaultBiquadValues: BiquadFilterType = {
  type: FilterTypeNames.BIQUAD,
  name: "",
  description: null,
  parameters: {
    type: "Lowshelf",
    freq: 20,
    q: 1.0,
    gain: 0,
  },
};

const Biquad = forwardRef<UseFormReturn<BiquadFilterType>, { filter: any; onRelease?: any }>(({ filter, onRelease }, ref) => {
  const {
    config: { filters },
  } = useSelector((state: any) => state.dsp);

  const formSchema = z.object({
    type: z.literal(FilterTypeNames.BIQUAD),
    name: z
      .string()
      .min(1, "Name is required")
      .refine((name) => name === filter?.name || !Object.keys(filters ?? {}).includes(name), { message: "A filter with this name already exists" }),
    description: z.string().nullable(),
    parameters: z.object({
      type: z.string(),
      freq: z.number(),
      q: z.number(),
      gain: z.number(),
    }),
  });

  const form = useForm<BiquadFilterType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      ...defaultBiquadValues,
      ...filter,
      parameters: {
        ...defaultBiquadValues.parameters,
        ...filter.parameters,
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

        <div className="col-span-2">
          <FormField
            control={form.control}
            name="parameters.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Type</FormLabel>
                <FormControl>
                  <SelectComboBox
                    items={OPTIONS_SUBTYPE}
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

        <div className="col-span-2">
          <FormField
            control={form.control}
            name="parameters.freq"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-base">Frequency (Hz)</FormLabel>
                <FormControl>
                  <InputNumber
                    {...field}
                    max={20000}
                    min={10}
                    value={field.value ?? 0}
                    step={1}
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
                    tickInterval={2}
                    unit={""}
                    value={[field.value]}
                    max={12}
                    min={-12}
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
            name="parameters.q"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Q Factor</FormLabel>
                <FormControl>
                  <Slider
                    showTicks
                    showLabels
                    tickInterval={2}
                    unit={""}
                    value={[field.value]}
                    max={10.0}
                    min={0.1}
                    step={0.1}
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
      </div>
    </Form>
  );
});

export default Biquad;
