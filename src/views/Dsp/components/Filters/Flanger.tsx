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

type GainFormValues = z.infer<typeof formSchema>;

const Flanger = forwardRef<UseFormReturn<GainFormValues>, { filter: any; onRelease: any }>(({ filter, onRelease }, ref) => {
  const form = useForm<GainFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: filter.type,
      description: filter.description ?? "",
      parameters: {
        ...filter.parameters,
        delay_ms: filter.parameters.delay_ms ?? 3,
        depth_ms: filter.parameters.depth_ms ?? 3,
        regen: filter.parameters.regen ?? 50,
        shape: filter.parameters.shape ?? "triangle",
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
