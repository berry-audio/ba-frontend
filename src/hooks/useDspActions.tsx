import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDspService } from "@/services/dsp";
import { DIALOG_EVENTS, INTERNAL_EVENTS } from "@/store/constants";
import { STAGE_TYPE } from "@/views/Dsp/types";
import { EVENTS } from "@/constants/events";
import { calculateChannels } from "@/util";

const DEFAULT_STAGE_VALUES: Record<string, any> = {
  [STAGE_TYPE.MIXER]: {
    type: STAGE_TYPE.MIXER,
    channels: null,
    name: null,
    description: null,
    bypassed: true,
  },
  [STAGE_TYPE.PROCESSOR]: {
    type: STAGE_TYPE.PROCESSOR,
    channels: null,
    name: null,
    description: null,
    bypassed: true,
  },
  [STAGE_TYPE.FILTER]: {
    type: STAGE_TYPE.FILTER,
    channels: null,
    names: [],
    description: null,
    bypassed: true,
  },
};

export const useDspActions = () => {
  const dispatch = useDispatch();

  const { config } = useSelector((state: any) => state.dsp);
  const { setDspConfig } = useDspService();

  const [loading, setLoading] = useState<boolean>(false);

  const saveFilter = async (values: any, autoSave: boolean = false) => {
    setLoading(true);
    try {
      const configUpdated = {
        ...config,
        filters: {
          ...config.filters,
          [values.name]: {
            type: values.type,
            description: values.description,
            parameters: {
              ...values.parameters,
            },
          },
        },
      };
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      await setDspConfig(configUpdated);

      if (!autoSave) {
        dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
        dispatch({
          type: INTERNAL_EVENTS.DSP_FILTER_SAVE,
          payload: { name: values.name },
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFilter = async (name: string) => {
    setLoading(true);
    try {
      const filters = { ...config.filters };
      delete filters[name];

      const configUpdated = { ...config, filters };

      await setDspConfig(configUpdated);

      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      dispatch({ type: INTERNAL_EVENTS.DSP_FILTER_DELETE, payload: { name } });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const bypassStage = async (index: number, bypassed: boolean) => {
    setLoading(true);

    try {
      const thisStage = config.pipeline[index];
      const thisStageType = thisStage.type;
      let allowBypass = false;

      if (thisStageType === STAGE_TYPE.MIXER || thisStageType === STAGE_TYPE.PROCESSOR) {
        if (thisStage.name !== null) {
          const { channelsInMatch, channelsOutMatch } = useChannelValidation(config, index, thisStageType, thisStage.name);
          if (channelsInMatch && channelsOutMatch) {
            allowBypass = true;
          }
        }
      }

      if (thisStageType === STAGE_TYPE.FILTER) {
        if (thisStage.names.length > 0) {
          allowBypass = true;
        }
      }

      let updatedStage: any = null;

      const configUpdated = {
        ...config,
        pipeline: (config.pipeline ?? []).map((stage: any, i: number) => {
          if (i !== index) return stage;

          updatedStage = { ...thisStage, bypassed: allowBypass ? bypassed : true };
          return updatedStage;
        }),
      };
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });

      if (allowBypass) {
        dispatch({ type: INTERNAL_EVENTS.DSP_STAGE_UPDATED });
        await setDspConfig(configUpdated);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changeStage = async (index: number, stageType: STAGE_TYPE) => {
    setLoading(true);

    try {
      let updatedStage: any = null;

      const configUpdated = {
        ...config,
        pipeline: (config.pipeline ?? []).map((stage: any, i: number) => {
          if (i !== index) return stage;

          const typeChanged = stageType && stageType !== stage.type;
          const base = typeChanged ? DEFAULT_STAGE_VALUES[stageType] : stage;

          updatedStage = { ...base, type: stageType, bypassed: true };
          return updatedStage;
        }),
      };

      const canUpdate =
        updatedStage.type === STAGE_TYPE.MIXER || updatedStage.type === STAGE_TYPE.PROCESSOR
          ? updatedStage.name !== null
          : updatedStage.type === STAGE_TYPE.FILTER
            ? updatedStage.names.length > 0
            : false;

      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });

      if (canUpdate) {
        dispatch({ type: INTERNAL_EVENTS.DSP_STAGE_UPDATED });
        await setDspConfig(configUpdated);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStage = async (index: number) => {
    setLoading(true);

    try {
      const configUpdated = {
        ...config,
        pipeline: config.pipeline.filter((_stage: any, i: number) => i !== index),
      };

      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      dispatch({ type: INTERNAL_EVENTS.DSP_STAGE_DELETED });
      await setDspConfig(configUpdated);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addStage = async (_: number) => {
    setLoading(true);
    try {
      const configUpdated = {
        ...config,
        pipeline: [...config.pipeline, DEFAULT_STAGE_VALUES[STAGE_TYPE.FILTER]],
      };

      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      // await setDspConfig(configUpdated);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addStageType = async (index: number, type: string, items: string[]) => {
    setLoading(true);

    try {
      const currentStage = config.pipeline[index];

      const updatedStage = {
        ...currentStage,
        type,
        ...(type === STAGE_TYPE.MIXER || type === STAGE_TYPE.PROCESSOR
          ? {
              name: items[0],
            }
          : {}),
        ...(type === STAGE_TYPE.FILTER
          ? {
              names: [...(currentStage.names ?? []), ...items],
            }
          : {}),
      };

      const configUpdated = {
        ...config,
        pipeline: config.pipeline.map((stage: any, i: number) => (i === index ? updatedStage : stage)),
      };

      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });

      if (type === (STAGE_TYPE.MIXER || STAGE_TYPE.PROCESSOR)) {
        const { channelsInMatch, channelsOutMatch } = useChannelValidation(config, index, type, items[0]);
        if (channelsInMatch && channelsOutMatch) {
          await setDspConfig(configUpdated);
        }
      }

      if (type === STAGE_TYPE.FILTER) {
        await setDspConfig(configUpdated);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStageType = async (stageIndex: number, stageType: string, typeIndex: number, typeName: string) => {
    setLoading(true);

    try {
      const currentStage = config.pipeline[stageIndex];
      const updatedStage =
        stageType === STAGE_TYPE.FILTER
          ? {
              ...currentStage,
              names: (currentStage.names ?? []).filter((_: string, i: number) => i !== typeIndex),
            }
          : {
              ...currentStage,
              name: null,
            };

      if (stageType === STAGE_TYPE.FILTER ? updatedStage.names.length === 0 : updatedStage.name === null) {
        updatedStage.bypassed = true;
      }

      const configUpdated = {
        ...config,
        pipeline: config.pipeline.map((stage: any, i: number) => (i === stageIndex ? updatedStage : stage)),
      };

      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      dispatch({ type: INTERNAL_EVENTS.DSP_STAGE_TYPE_DELETED, payload: { stageType, typeName } });

      if (stageType === (STAGE_TYPE.MIXER || STAGE_TYPE.PROCESSOR)) {
        const { channelsInMatch, channelsOutMatch } = useChannelValidation(config, stageIndex, stageType, typeName);
        if (channelsInMatch && channelsOutMatch) {
          await setDspConfig(configUpdated);
        }
      }

      if (stageType === STAGE_TYPE.FILTER) {
        await setDspConfig(configUpdated);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStageChannels = async (stageIndex: number, channels: number[], channelsCount: number) => {
    setLoading(true);

    try {
      const currentStage = config.pipeline[stageIndex];
      const updatedStage = {
        ...currentStage,
        channels: channels.length === channelsCount ? null : channels,
      };
      const configUpdated = {
        ...config,
        pipeline: config.pipeline.map((stage: any, i: number) => (i === stageIndex ? updatedStage : stage)),
      };

      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      dispatch({ type: INTERNAL_EVENTS.DSP_STAGE_CHANNEL_UPDATED });

      await setDspConfig(configUpdated);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { saveFilter, deleteFilter, addStage, deleteStage, changeStage, bypassStage, addStageType, deleteStageType, updateStageChannels, loading };
};

export const useChannelValidation = (config: any, stageIndex: number, stageType: string, typeName: string) => {
  const channelsInAllowed = calculateChannels(config, stageIndex);
  const channelsOutAllowed = config.devices.playback.channels;

  let channelsIn: number;
  let channelsOut: number;

  if (stageType === STAGE_TYPE.MIXER) {
    const mixer = config?.mixers?.[typeName];
    channelsIn = mixer.channels.in;
    channelsOut = mixer.channels.out;
  } else if (stageType === STAGE_TYPE.PROCESSOR) {
    const processor = config?.processors?.[typeName];
    channelsIn = processor.parameters.channels;
    channelsOut = processor.parameters.channels;
  } else {
    channelsIn = 0;
    channelsOut = 0;
  }

  return {
    channelsInAllowed,
    channelsInMatch: channelsInAllowed === channelsIn,
    channelsOutAllowed,
    channelsOutMatch: channelsOutAllowed === channelsOut,
    channelsIn,
    channelsOut,
  };
};
