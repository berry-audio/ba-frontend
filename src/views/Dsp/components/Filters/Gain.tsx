import { forwardRef, useImperativeHandle } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Slider } from "@/components/Form/Slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

const formSchema = z.object({
  type: z.string(),
  description: z.string(),
  parameters: z.object({
    gain: z.number(),
    inverted: z.boolean(),
    mute: z.boolean(),
    scale: z.string(),
  }),
});

type GainFormValues = z.infer<typeof formSchema>;

const Gain = forwardRef<UseFormReturn<GainFormValues>, { filter: any; onRelease: any }>(({ filter, onRelease }, ref) => {
  const form = useForm<GainFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: filter.type,
      description: filter.description ?? "",
      parameters: {
        ...filter.parameters,
        inverted: filter.parameters.inverted ?? false,
        mute: filter.parameters.mute ?? false,
      },
    },
  });

  useImperativeHandle(ref, () => form, [form]);

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

        <div className="col-span-2 my-2">
          <FormField
            control={form.control}
            name="parameters.gain"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Gain</FormLabel>
                <FormControl>
                  <Slider
                    showTicks
                    showLabels
                    tickInterval={50}
                    unit={filter.parameters.scale}
                    value={[field.value]}
                    max={150}
                    min={-150}
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
