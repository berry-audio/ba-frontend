import { forwardRef, useImperativeHandle } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Slider } from "@/components/Form/Slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputNumber } from "@/components/Form/InputNumber";
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

const formSchema = z.object({
  type: z.string(),
  description: z.string(),
  parameters: z.object({
    type: z.string(),
    freq: z.number(),
    q: z.number(),
    gain: z.number(),
  }),
});

type GainFormValues = z.infer<typeof formSchema>;

const Biquad = forwardRef<UseFormReturn<GainFormValues>, { filter: any; onRelease: any }>(({ filter, onRelease }, ref) => {
  const form = useForm<GainFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: filter.type,
      description: filter.description ?? "",
      parameters: {
        ...filter.parameters,
        // inverted: filter.parameters.inverted ?? false,
        // mute: filter.parameters.mute ?? false,
      },
    },
  });

  useImperativeHandle(ref, () => form, [form]);

  console.log(filter);

  return (
    <Form {...form}>
      <div className="grid grid-cols-2 gap-5">
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
