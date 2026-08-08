import { zodResolver } from "@hookform/resolvers/zod";
import { useFormActions } from "@/hooks/useFormActions";
import { useForm } from "react-hook-form";
import { InputNumber } from "@/components/Form/InputNumber";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";

import Page from "@/components/Page";
import ButtonSave from "@/components/Button/ButtonSave";
import SelectSampleRate from "@/components/Form/SelectSampleRate";

export const formSchema = z.object({
  usbdac: z.object({
    enable: z.boolean(),
    sample_rate: z.number({
      error: () => "Sample rate is required",
    }),
    gain: z.number(),
  }),
});

const SettingsUsbdac = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { onSubmitHandler, config, loading } = useFormActions(form);
  const hardware = config.system.hardware;
  const isEnabled = form.watch("usbdac.enable");

  return (
    <Page
      backButton
      title="USB DAC"
      rightComponent={
        <div className="flex">
          <div className="mr-4">
            <ButtonSave onClick={onSubmitHandler} isLoading={loading} />
          </div>
        </div>
      }
    >
      {hardware === "PI_ZERO_2W" ? (
        <Form {...form}>
          <form onSubmit={onSubmitHandler} className="space-y-6 max-w-md">
            <div className="lg:px-0 px-6 py-3 lg:w-90">
              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="usbdac.enable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base block">Enable USB DAC</FormLabel>
                      <div className="pb-4 text-secondary text-md">Use your Raspberry Pi as a USB Soundcard.</div>
                      <FormControl>
                        <Switch {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="usbdac.sample_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base block">Capture Sample Rate (Hz)</FormLabel>
                      <div className="pb-4 text-secondary text-md">
                        Check your DAC specifications for supported sample rates. Should not be higher than the DSP sample rate{" "}
                        {config.dsp.resample_rate} Hz.
                      </div>
                      <FormControl>
                        <SelectSampleRate placeholder="Select sample rate" {...field} disabled={!isEnabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="usbdac.gain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base block">Gain (dB)</FormLabel>
                      <FormControl>
                        <InputNumber {...field} max={20} min={-20} disabled={!isEnabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      ) : (
        <>
          <h2 className="mt-3 text-xl">Information</h2>
          <div className="pb-4 text-secondary text-md">
            Using this device as a USB DAC.<br></br>This feature is only available on Raspberry Pi Zero 2W.
          </div>
        </>
      )}
    </Page>
  );
};

export default SettingsUsbdac;
