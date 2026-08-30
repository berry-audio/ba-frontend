import { useFormActions } from "@/hooks/useFormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

import Page from "@/components/Page";
import ButtonSave from "@/components/Button/ButtonSave";
import SelectDisplayDevices from "@/components/Form/SelectDisplay";
import SelectVisualizer from "@/components/Form/SelectVisualizer";

export const formSchema = z.object({
  display: z.object({
    output_display: z.string().nullable(),
    visualizer_layout: z.number(),
  }),
});

const SettingsDisplay = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { onSubmitHandler, loading } = useFormActions(form);

  return (
    <Page
      backButton
      title="Display"
      rightComponent={
        <div className="flex">
          <div className="mr-3">
            <ButtonSave onClick={onSubmitHandler} isLoading={loading} />
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={onSubmitHandler} className="space-y-6 max-w-md text-base">
          <div className="lg:px-0 px-6 py-3 lg:w-90">
            <div className="mb-6">
              <FormField
                control={form.control}
                name="display.output_display"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-base">Display</FormLabel>
                    <FormControl>
                      <SelectDisplayDevices placeholder="Select Display" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-6">
              <FormField
                control={form.control}
                name="display.visualizer_layout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base block">Default Visualizer</FormLabel>
                    <FormControl>
                      <SelectVisualizer placeholder="Select Visualiser" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </Page>
  );
};
export default SettingsDisplay;
