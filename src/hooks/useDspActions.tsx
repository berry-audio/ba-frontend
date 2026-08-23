import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDspService } from "@/services/dsp";
import { DIALOG_EVENTS, INTERNAL_EVENTS } from "@/store/constants";
import { STAGE_TYPE } from "@/views/Dsp/types";
import { EVENTS } from "@/constants/events";

const useDspActions = () => {
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

  const saveStage = async (values: any) => {
    setLoading(true);
    try {
      const configUpdated = {
        ...config,
        pipeline: values,
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

      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
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
      const defaultStageValues = {
        type: STAGE_TYPE.FILTER,
        channels: null,
        names: [],
        description: null,
        bypassed: true,
      };

      const configUpdated = {
        ...config,
        pipeline: [...config.pipeline, defaultStageValues],
      };

      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      await setDspConfig(configUpdated);
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
        ...(type === STAGE_TYPE.FILTER || type === STAGE_TYPE.PROCESSOR
          ? {
              names: [...(currentStage.names ?? []), ...items],
            }
          : {}),
        ...(type === STAGE_TYPE.MIXER
          ? {
              name: items[0],
            }
          : {}),
      };

      const configUpdated = {
        ...config,
        pipeline: config.pipeline.map((stage: any, i: number) => (i === index ? updatedStage : stage)),
      };

      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      await setDspConfig(configUpdated);
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
      const updatedStage = {
        ...currentStage,
        ...(stageType === STAGE_TYPE.FILTER || stageType === STAGE_TYPE.PROCESSOR
          ? {
              names: (currentStage.names ?? []).filter((_: string, i: number) => i !== typeIndex),
            }
          : {}),
        ...(stageType === STAGE_TYPE.MIXER
          ? {
              names: (currentStage.names ?? []).filter((name: string) => name !== typeName),
            }
          : {}),
      };
      const configUpdated = {
        ...config,
        pipeline: config.pipeline.map((stage: any, i: number) => (i === stageIndex ? updatedStage : stage)),
      };

      dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE });
      dispatch({ type: EVENTS.DSP_STATE_CHANGED, payload: { config: configUpdated } });
      await setDspConfig(configUpdated);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { saveFilter, deleteFilter, addStage, deleteStage, saveStage, addStageType, deleteStageType, loading };
};

export default useDspActions;
