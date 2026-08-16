import { forwardRef, useImperativeHandle } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Slider } from "@/components/Form/Slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  type: z.string(),
  description: z.string(),
  parameters: z.object({
    semitones: z.number(),
    tempo: z.number(),
    wet: z.number(),
  }),
});

type GainFormValues = z.infer<typeof formSchema>;

const Pitch = forwardRef<UseFormReturn<GainFormValues>, { filter: any; onRelease: any }>(({ filter, onRelease }, ref) => {
  const form = useForm<GainFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: filter.type,
      description: filter.description ?? "",
      parameters: {
        ...filter.parameters,
        tempo: 1,
        wet: 1,
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
