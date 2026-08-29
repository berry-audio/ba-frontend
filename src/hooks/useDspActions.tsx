import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDspService } from "@/services/dsp";
import { DIALOG_EVENTS, INTERNAL_EVENTS } from "@/store/constants";
import { STAGE_TYPE } from "@/views/Dsp/types";
import { EVENTS } from "@/constants/events";

const DEFAULT_STAGE_VALUES: Record<string, any> = {
  [STAGE_TYPE.MIXER]: {
    type: STAGE_TYPE.MIXER,
    name: "",
    description: null,
    bypassed: true,
  },
  [STAGE_TYPE.PROCESSOR]: {
    type: STAGE_TYPE.PROCESSOR,
    name: "",
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
    const stage = config.pipeline[index];

    try {
      const configUpdated = {
        ...config,
        pipeline: (config.pipeline ?? []).map((stage: any, i: number) => (i === index ? { ...stage, bypassed } : stage)),
      };

      if (stage.type === STAGE_TYPE.FILTER) {
        dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      }

      await setDspConfig(configUpdated);
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      dispatch({ type: INTERNAL_EVENTS.DSP_STAGE_UPDATED });
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

      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
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
      await setDspConfig(configUpdated);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const moveStage = async (pipeline: any[]) => {
    setLoading(true);

    try {
      const configUpdated = {
        ...config,
        pipeline,
      };

      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      await setDspConfig(configUpdated);
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

      await setDspConfig(configUpdated);
      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      dispatch({ type: INTERNAL_EVENTS.DSP_STAGE_DELETED });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addStageType = async (index: number, type: string, items: string[]) => {
    if (!items.length) return;
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
      await setDspConfig(configUpdated);
      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      dispatch({ type: INTERNAL_EVENTS.DSP_STAGE_UPDATED });
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
              name: "",
            };

      if (stageType === STAGE_TYPE.FILTER ? updatedStage.names.length === 0 : updatedStage.name === "") {
        updatedStage.bypassed = true;
      }

      const configUpdated = {
        ...config,
        pipeline: config.pipeline.map((stage: any, i: number) => (i === stageIndex ? updatedStage : stage)),
      };

      await setDspConfig(configUpdated);
      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      dispatch({ type: INTERNAL_EVENTS.DSP_STAGE_TYPE_DELETED, payload: { stageType, typeName } });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const moveStageType = async (stageIndex: number, names: string[]) => {
    setLoading(true);

    try {
      const stage = config.pipeline[stageIndex];
      const updatedStage = { ...stage, names };
      const pipeline = config.pipeline.map((s: any, i: number) => (i === stageIndex ? updatedStage : s));

      const configUpdated = {
        ...config,
        pipeline,
      };

      await setDspConfig(configUpdated);
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
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

      await setDspConfig(configUpdated);
      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      dispatch({ type: INTERNAL_EVENTS.DSP_STAGE_CHANNEL_UPDATED });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveFilter,
    deleteFilter,
    addStage,
    deleteStage,
    changeStage,
    moveStage,
    bypassStage,
    addStageType,
    deleteStageType,
    moveStageType,
    updateStageChannels,
    loading,
  };
};
