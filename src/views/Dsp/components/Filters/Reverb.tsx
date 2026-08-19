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

export type ReverbFilterType = {
  type: FilterTypeNames.REVERB;
  name: string;
  description: string | null;
  parameters: {
    reverberance: number;
    hf_damping: number;
    room_scale: number;
    stereo_depth: number;
    pre_delay_ms: number;
    wet_gain_db: number;
    wet: number;
  };
};

export const defaultReverbValues: ReverbFilterType = {
  type: FilterTypeNames.REVERB,
  name: "",
  description: null,
  parameters: {
    reverberance: 30,
    hf_damping: 0,
    room_scale: 30,
    stereo_depth: 0,
    pre_delay_ms: 0,
    wet_gain_db: 0,
    wet: 0.2,
  },
};

const Reverb = forwardRef<UseFormReturn<ReverbFilterType>, { filter: any; onRelease?: any }>(({ filter, onRelease }, ref) => {
  const {
    config: { filters },
  } = useSelector((state: any) => state.dsp);

  const formSchema = z.object({
    type: z.literal(FilterTypeNames.REVERB),
    name: z
      .string()
      .min(1, "Name is required")
      .refine((name) => name === filter?.name || !Object.keys(filters ?? {}).includes(name), { message: "A filter with this name already exists" }),
    description: z.string().nullable(),
    parameters: z.object({
      reverberance: z.number(),
      hf_damping: z.number(),
      room_scale: z.number(),
      stereo_depth: z.number(),
      pre_delay_ms: z.number(),
      wet_gain_db: z.number(),
      wet: z.number(),
    }),
  });

  const form = useForm<ReverbFilterType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      ...defaultReverbValues,
      ...filter,
      parameters: {
        ...defaultReverbValues.parameters,
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

        <div className="col-span-2 my-2">
          <FormField
            control={form.control}
            name="parameters.reverberance"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Reverberance</FormLabel>
                <FormControl>
                  <Slider
                    showTicks
                    showLabels
                    tickInterval={10}
                    value={[field.value]}
                    max={80}
                    min={0}
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

        <div className="col-span-2 my-2">
          <FormField
            control={form.control}
            name="parameters.room_scale"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Room Size</FormLabel>
                <FormControl>
                  <Slider
                    showTicks
                    showLabels
                    tickInterval={5}
                    value={[field.value]}
                    max={50}
                    min={0}
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

        <div className="col-span-1">
          <FormField
            control={form.control}
            name="parameters.wet"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-base">Wet</FormLabel>
                <FormControl>
                  <InputNumber
                    {...field}
                    max={1.0}
                    min={0}
                    value={field.value ?? 0}
                    step={0.01}
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
            name="parameters.wet_gain_db"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-base">Gain (dB)</FormLabel>
                <FormControl>
                  <InputNumber
                    {...field}
                    max={20}
                    min={-20}
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
      </div>
    </Form>
  );
});

export default Reverb;
