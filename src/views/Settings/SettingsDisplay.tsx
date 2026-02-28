import { useEffect, useState } from "react";
import { useConfigService } from "@/services/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useDispatch } from "react-redux";
import { DIALOG_EVENTS } from "@/store/constants";
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
  const dispatch = useDispatch();
  const { getConfig, setConfig } = useConfigService();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    (async () => {
      const _config = await getConfig();
      form.reset({ ..._config });
    })();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await setConfig(values);
    console.log(values);
    dispatch({ type: DIALOG_EVENTS.DIALOG_REBOOT });
    setLoading(false);
  };

  return (
    <Page
      backButton
      title="Display"
      rightComponent={
        <div className="flex">
          <div className="mr-4">
            <ButtonSave onClick={form.handleSubmit(onSubmit)} isLoading={loading} />
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
          <div className="lg:px-0 px-6 py-3 lg:w-90">
            <div>
              <h2 className="mt-3 mb-3 text-xl">Device</h2>
            </div>
            <div className="mb-6">
              <FormField
                control={form.control}
                name="display.output_display"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium text-muted">Display</FormLabel>
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
                    <FormLabel className="text-md block font-medium text-muted">Default Visualizer</FormLabel>
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
