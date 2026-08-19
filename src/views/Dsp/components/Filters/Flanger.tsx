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

export type FlangerFilterType = {
  type: FilterTypeNames.FLANGER;
  name: string;
  description: string | null;
  parameters: {
    delay_ms: number;
    depth_ms: number;
    regen: number;
    width: number;
    speed_hz: number;
    shape: string;
    phase_deg: number;
    wet: number;
  };
};

export const defaultFlangerValues: FlangerFilterType = {
  type: FilterTypeNames.FLANGER,
  name: "",
  description: null,
  parameters: {
    delay_ms: 3,
    depth_ms: 3,
    regen: 50,
    width: 0,
    speed_hz: 0,
    shape: "triangle",
    phase_deg: 0,
    wet: 0,
  },
};

const Flanger = forwardRef<UseFormReturn<FlangerFilterType>, { filter: any; onRelease?: any }>(({ filter, onRelease }, ref) => {
  const {
    config: { filters },
  } = useSelector((state: any) => state.dsp);

  const formSchema = z.object({
    type: z.literal(FilterTypeNames.FLANGER), // adjust to the actual enum value for this filter
    name: z
      .string()
      .refine((name) => name === filter?.name || !Object.keys(filters ?? {}).includes(name), { message: "A filter with this name already exists" }),
    description: z.string().nullable(),
    parameters: z.object({
      delay_ms: z.number(),
      depth_ms: z.number(),
      regen: z.number(),
      width: z.number(),
      speed_hz: z.number(),
      shape: z.string(),
      phase_deg: z.number(),
      wet: z.number(),
    }),
  });

  const form = useForm<FlangerFilterType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      ...defaultFlangerValues,
      ...filter,
      parameters: {
        ...defaultFlangerValues.parameters,
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

        <div className="col-span-1">
          <FormField
            control={form.control}
            name="parameters.delay_ms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-base">Delay (Ms)</FormLabel>
                <FormControl>
                  <InputNumber
                    {...field}
                    max={30}
                    min={0}
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

        <div className="col-span-1">
          <FormField
            control={form.control}
            name="parameters.depth_ms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-base">Depth (Ms)</FormLabel>
                <FormControl>
                  <InputNumber
                    {...field}
                    max={10}
                    min={0}
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
            name="parameters.width"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Width</FormLabel>
                <FormControl>
                  <Slider
                    showTicks
                    showLabels
                    tickInterval={10}
                    value={[field.value]}
                    max={100}
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
            name="parameters.speed_hz"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Speed Hz</FormLabel>
                <FormControl>
                  <Slider
                    showTicks
                    showLabels
                    tickInterval={2}
                    value={[field.value]}
                    max={10.0}
                    min={0.0}
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

        <div className="col-span-1">
          <FormField
            control={form.control}
            name="parameters.phase_deg"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-base">Phase Angle</FormLabel>
                <FormControl>
                  <InputNumber
                    {...field}
                    max={360}
                    min={0}
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
                    step={0.1}
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

export default Flanger;
