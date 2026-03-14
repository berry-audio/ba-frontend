import { useEffect, useState } from "react";
import { useConfigService } from "@/services/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useDispatch } from "react-redux";
import { DIALOG_EVENTS } from "@/store/constants";
import { z } from "zod";

import Page from "@/components/Page";
import ButtonSave from "@/components/Button/ButtonSave";

export const formSchema = z.object({
  storage: z.object({
    username: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 3, {
        message: "Username must be at least 2 characters",
      }),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: "Password must be at least 6 characters",
      }),
  }),
});

const SettingsSharing = () => {
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
    dispatch({ type: DIALOG_EVENTS.DIALOG_REBOOT });
    setLoading(false);
  };

  return (
    <Page
      backButton
      title="Sharing"
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
              <h2 className="mt-3 mb-3 text-xl">Authentication</h2>
            </div>
            <div className="pt-2 pb-4 text-secondary">
              To access shared folders on BerryAudio OS, users will be required to use the credentials below. Leave blank for no authentication.
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="storage.username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium text-muted">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="storage.password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md block font-medium text-muted">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
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

export default SettingsSharing;
