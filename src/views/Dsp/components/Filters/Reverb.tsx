import { forwardRef, useImperativeHandle } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Slider } from "@/components/Form/Slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputNumber } from "@/components/Form/InputNumber";
import { z } from "zod";

const formSchema = z.object({
  type: z.string(),
  description: z.string(),
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

type GainFormValues = z.infer<typeof formSchema>;

const Reverb = forwardRef<UseFormReturn<GainFormValues>, { filter: any; onRelease: any }>(({ filter, onRelease }, ref) => {
  const form = useForm<GainFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: filter.type,
      description: filter.description ?? "",
      parameters: {
        ...filter.parameters,
        hf_damping: filter.parameters.hf_damping ?? 0,
        pre_delay_ms: filter.parameters.pre_delay_ms ?? 0,
        stereo_depth: filter.parameters.pre_delay_ms ?? 0,
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
