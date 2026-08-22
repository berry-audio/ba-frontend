import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDspService } from "@/services/dsp";
import { INTERNAL_EVENTS } from "@/store/constants";

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

      await setDspConfig(configUpdated);

      if (!autoSave) {
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

      dispatch({ type: INTERNAL_EVENTS.DSP_FILTER_DELETE, payload: { name } });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveStage = async (values: any, autoSave: boolean = false) => {
    setLoading(true);
    try {
      const configUpdated = {
        ...config,
        pipeline: values,
      };

      await setDspConfig(configUpdated);

      // if (!autoSave) {
      //   dispatch({
      //     type: INTERNAL_EVENTS.DSP_FILTER_SAVE,
      //     payload: { name: values.name },
      //   });
      // }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { saveFilter, deleteFilter, saveStage, loading };
};

export default useDspActions;
