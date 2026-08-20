import { useState } from "react";
import { useDispatch } from "react-redux";
import { useDspService } from "@/services/dsp";
import { INTERNAL_EVENTS } from "@/store/constants";

const useDspActions = () => {
  const dispatch = useDispatch();
  const { getDspConfig, setDspConfig } = useDspService();

  const [loading, setLoading] = useState<boolean>(false);

  const saveFilter = async (values: any, autoSave: boolean = false) => {
    setLoading(true);
    try {
      const currentConfig = await getDspConfig();
      const config = {
        ...currentConfig,
        filters: {
          ...currentConfig.filters,
          [values.name]: {
            type: values.type,
            description: values.description,
            parameters: {
              ...values.parameters,
            },
          },
        },
      };

      await setDspConfig(config);

      dispatch({
        type: INTERNAL_EVENTS.DSP_CONFIG_STATE,
        payload: { config },
      });

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
      const currentConfig = await getDspConfig();

      const filters = { ...currentConfig.filters };
      delete filters[name];

      const config = { ...currentConfig, filters };

      await setDspConfig(config);

      dispatch({ type: INTERNAL_EVENTS.DSP_CONFIG_STATE, payload: { config } });
      dispatch({ type: INTERNAL_EVENTS.DSP_FILTER_DELETE, payload: { name } });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { saveFilter, deleteFilter, loading };
};

export default useDspActions;
