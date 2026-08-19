import { forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { Slider } from "@/components/Form/Slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilterTypeNames } from "../../types";
import { z } from "zod";

export type PitchFilterType = {
  type: FilterTypeNames.PITCH;
  name: string;
  description: string;
  parameters: {
    semitones: number;
    tempo: number;
    wet: number;
  };
};

export const defaultPitchValues: PitchFilterType = {
  type: FilterTypeNames.PITCH,
  name: "",
  description: "",
  parameters: {
    semitones: 0,
    tempo: 0,
    wet: 0,
  },
};

const Pitch = forwardRef<UseFormReturn<PitchFilterType>, { filter: any; onRelease?: any }>(({ filter, onRelease }, ref) => {
  const {
    config: { filters },
  } = useSelector((state: any) => state.dsp);

  const formSchema = z.object({
    type: z.literal(FilterTypeNames.PITCH),
    name: z
      .string()
      .refine((name) => name === filter?.name || !Object.keys(filters ?? {}).includes(name), { message: "A filter with this name already exists" }),
    description: z.string(),
    parameters: z.object({
      semitones: z.number(),
      tempo: z.number(),
      wet: z.number(),
    }),
  });

  const form = useForm<PitchFilterType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      ...defaultPitchValues,
      ...filter,
      parameters: {
        ...defaultPitchValues.parameters,
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
            name="parameters.semitones"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Pitch</FormLabel>
                <FormControl>
                  <Slider
                    showTicks
                    showLabels
                    tickInterval={1}
                    value={[field.value]}
                    max={5}
                    min={-5}
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
      </div>
    </Form>
  );
});

export default Pitch;
