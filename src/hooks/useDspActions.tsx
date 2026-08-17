import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useDspService } from "@/services/dsp";
import { INTERNAL_EVENTS } from "@/store/constants";

const useDspActions = () => {
  const dispatch = useDispatch();
  const { getDspConfig, setDspConfig } = useDspService();

  const [loading, setLoading] = useState<boolean>(false);

  const saveFilter = useCallback(
    async (name: string, params: any) => {
      setLoading(true);
      try {
        const currentConfig = await getDspConfig();
        const config = {
          ...currentConfig,
          filters: {
            ...currentConfig.filters,
            [name]: { ...params },
          },
        };

        await setDspConfig(config);

        dispatch({
          type: INTERNAL_EVENTS.DSP_CONFIG_STATE,
          payload: { config },
        });
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  return { saveFilter, loading };
};

export default useDspActions;
