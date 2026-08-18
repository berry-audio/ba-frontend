import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/Form/InputNumber";
import { z } from "zod";

import type { Resolver } from "react-hook-form";
import SelectComboBox from "@/components/Form/SelectComboBox";
import Chart from "@/components/Charts";

type BiquadComboFormValues = {
  type: string;
  description: string;
  parameters: {
    type: string;
    freq_min: number;
    freq_max: number;
    freq: number;
    order: number;
    gain: number;
    gains: number[];
  };
};

const OPTIONS_SUBTYPE = [
  { value: "ButterworthLowpass", label: "Butterworth Lowpass" },
  { value: "ButterworthHighpass", label: "Butterworth Highpass" },
  { value: "LinkwitzRileyLowpass", label: "Linkwitz-Riley Lowpass" },
  { value: "LinkwitzRileyHighpass", label: "Linkwitz-Riley Highpass" },
  { value: "GraphicEqualizer", label: "Graphic Equalizer" },
  { value: "Tilt", label: "Tilt Equalizer" },
];

const ORDER_FREQ_TYPES = ["ButterworthLowpass", "ButterworthHighpass", "LinkwitzRileyLowpass", "LinkwitzRileyHighpass"] as const;

const orderFreqSchema = z.object({
  type: z.string(),
  description: z.string(),
  parameters: z.object({
    type: z.string(),
    freq: z.number(),
    order: z.number(),
  }),
});

const tiltSchema = z.object({
  type: z.string(),
  description: z.string(),
  parameters: z.object({
    type: z.string(),
    gain: z.number(),
  }),
});

const graphicEqSchema = z.object({
  type: z.string(),
  description: z.string(),
  parameters: z.object({
    type: z.string(),
    freq_min: z.number(),
    freq_max: z.number(),
    gains: z.number().array(),
  }),
});

function getSchemaForType(type: string) {
  if (type === "Tilt") return tiltSchema;
  if (type === "GraphicEqualizer") return graphicEqSchema;
  return orderFreqSchema;
}

const dynamicResolver: Resolver<BiquadComboFormValues> = async (values) => {
  const result = getSchemaForType(values?.parameters?.type).safeParse(values);
  return result.success
    ? { values: result.data as BiquadComboFormValues, errors: {} }
    : { values: {}, errors: Object.fromEntries(result.error.issues.map((i) => [i.path.join("."), { type: i.code, message: i.message }])) };
};

function bandFrequency(fmin: number, fmax: number, bandLength: number, band: number) {
  const fMinLog = Math.log(fmin) / Math.log(2);
  const fMaxLog = Math.log(fmax) / Math.log(2);
  const bw = (fMaxLog - fMinLog) / bandLength;
  const freqLog = fMinLog + (band + 0.5) * bw;
  return Math.pow(2, freqLog);
}

function formatBandValue(freq: number) {
  if (freq < 10) return freq.toFixed(1);
  if (freq < 1000) return freq.toFixed(0);
  if (freq < 10000) return `${(freq / 1000).toFixed(1)}k`;
  return `${(freq / 1000).toFixed(0)}k`;
}

function resizeGains(gains: number[], newCount: number) {
  if (newCount === gains.length) return gains;
  if (newCount < gains.length) return gains.slice(0, newCount);
  return [...gains, ...Array(newCount - gains.length).fill(0)];
}

const BiquadCombo = forwardRef<UseFormReturn<BiquadComboFormValues>, { filter: any; onRelease: any }>(({ filter, onRelease }, ref) => {
  const params = filter?.parameters;

  const initialGains = params?.gains ?? [0.0, 0.0, 0.0, 0.0, 0.0];
  const initialFmin = params?.freq_min ?? 20;
  const initialFmax = params?.freq_max ?? 20000;

  const [gains, setGains] = useState<number[]>(initialGains);
  const [bands, setBands] = useState<number>(initialGains.length);

  const form = useForm<BiquadComboFormValues>({
    resolver: dynamicResolver,
    defaultValues: {
      type: filter.type,
      description: filter.description ?? "",
      parameters: {
        type: params?.type ?? "GraphicEqualizer",
        freq_min: initialFmin,
        freq_max: initialFmax,
        freq: params?.freq ?? 20,
        order: params?.order ?? 1,
        gain: params?.gain ?? 0,
        gains: initialGains,
      },
    },
  });

  useImperativeHandle(ref, () => form, [form]);

  const subType = form.watch("parameters.type");
  const watchedFmin = form.watch("parameters.freq_min") ?? initialFmin;
  const watchedFmax = form.watch("parameters.freq_max") ?? initialFmax;

  const freqs = Array.from({ length: bands }, (_, i) => bandFrequency(watchedFmin, watchedFmax, bands, i));
  const labels = freqs.map(formatBandValue);

  const onBandsChange = (value: number, onFieldChange: (gains: number[]) => void) => {
    setBands(value);
    setGains((prev) => {
      const next = resizeGains(prev, value);
      onFieldChange(next);
      return next;
    });
    onRelease();
  };

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

        <div className="col-span-2">
          <FormField
            control={form.control}
            name="parameters.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base block">Type</FormLabel>
                <FormControl>
                  <SelectComboBox
                    items={OPTIONS_SUBTYPE}
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

        {ORDER_FREQ_TYPES.includes(subType as any) && (
          <>
            <div className="col-span-1">
              <FormField
                control={form.control}
                name="parameters.order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-base">Order</FormLabel>
                    <FormControl>
                      <InputNumber
                        {...field}
                        max={100}
                        min={1}
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
                name="parameters.freq"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-base">Frequency</FormLabel>
                    <FormControl>
                      <InputNumber
                        {...field}
                        max={20000}
                        min={20}
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
          </>
        )}

        {subType === "Tilt" && (
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="parameters.gain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-base">Gain</FormLabel>
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
        )}

        {subType === "GraphicEqualizer" && (
          <>
            <div className="col-span-1">
              <FormField
                control={form.control}
                name="parameters.freq_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-base">Frequency Min (Hz)</FormLabel>
                    <FormControl>
                      <InputNumber
                        {...field}
                        max={20000}
                        min={20}
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
                name="parameters.freq_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-base">Frequency Max (Hz)</FormLabel>
                    <FormControl>
                      <InputNumber
                        {...field}
                        max={20000}
                        min={20}
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
                name="parameters.gains"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-base">Bands</FormLabel>
                    <FormControl>
                      <InputNumber max={20} min={5} value={bands} step={1} onChange={(value) => onBandsChange(value, field.onChange)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="parameters.gains"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Chart
                        labels={labels}
                        values={gains}
                        min={-12}
                        max={12}
                       onChangeCommitted={(newGains) => {
                          setGains(newGains);
                          field.onChange(newGains);
                          onRelease();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
      </div>
    </Form>
  );
});

export default BiquadCombo;
