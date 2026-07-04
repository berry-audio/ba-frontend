import { useEffect, useState } from "react";
import { useFormActions } from "@/hooks/useFormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputNumber } from "@/components/Form/InputNumber";
import { AlsaCard } from "@/types";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

import Page from "@/components/Page";
import ButtonSave from "@/components/Button/ButtonSave";
import SelectAlsaVolumeDevice from "@/components/Form/SelectAlsaVolumeDevice";
import SelectAlsaCard from "@/components/Form/SelectAlsaCard";

export const formSchema = z.object({
  mixer: z.object({
    hw_device_id: z.number().nullable(),
    hw_device: z.string().nullable(),
    volume_default: z.number(),
    volume_device: z.string(),
    dtoverlay: z.string().nullable(),
  }),
});

const SettingsMixer = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { onSubmitHandler, config, loading } = useFormActions(form);
  const [selectedCard, setSelectedCard] = useState<string>();

  useEffect(() => {
    setSelectedCard(config.mixer?.hw_device);
  }, [config]);

  return (
    <Page
      backButton
      title="Mixer"
      rightComponent={
        <div className="flex">
          <div className="mr-4">
            <ButtonSave onClick={onSubmitHandler} isLoading={loading} />
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={onSubmitHandler} className="space-y-6 max-w-md">
          <div className="lg:px-0 px-6 py-3 lg:w-90">
            <div className="mb-6">
              <FormField
                control={form.control}
                name="mixer.hw_device_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base block">Audio Device</FormLabel>
                    <div className="pb-4 text-secondary text-md">
                      All audio will be played through the selected device. If your device isn't listed, add its dtoverlay and restart — it will then
                      appear in the list. Note: Restart required after changing this setting.
                    </div>
                    <FormControl>
                      <SelectAlsaCard
                        placeholder="Select Device"
                        {...field}
                        onSelectedCard={(alsaCard: AlsaCard) => {
                          alsaCard.device && setSelectedCard(alsaCard.device);
                          form.setValue("mixer.dtoverlay", alsaCard.dtoverlay ?? "", { shouldDirty: true });
                          form.setValue("mixer.hw_device", alsaCard.device ?? "", { shouldDirty: true });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="mixer.dtoverlay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base block">DT Overlay</FormLabel>
                    <div className="pb-4 text-secondary text-md">
                      While this is automatically set if you need to set it manually. please refer to your DAC manufacturer’s documentation for this
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="mixer.volume_device"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base block">Volume Device</FormLabel>
                    <div className="pb-4 text-secondary text-md">
                      Select the hardware that controls the volume. Some DACs dont offer hardware volume use software instead. Note: Restart required
                      after changing mixer settings for volume options to update.
                    </div>
                    <FormControl>
                      <SelectAlsaVolumeDevice placeholder="Select Volume" device={selectedCard} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="mixer.volume_default"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base block">Default Volume</FormLabel>
                    <FormControl>
                      <InputNumber {...field} max={100} />
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

export default SettingsMixer;
