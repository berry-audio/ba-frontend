import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchJsonRpc } from "@/util";

const useDspActions = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const saveFilter = useCallback(
    async (name: string, params: any) => {
      setLoading(true);
      try {
        const config = await fetchJsonRpc<any>("dsp.get_config", 102);

        const buildConfig = {
          ...config,
          filters: {
            ...config.filters,
            [name]: { ...params },
          },
        };

        await fetchJsonRpc<any>("dsp.set_config", 102, { config: buildConfig });

        // dispatch({
        //   type: INTERNAL_EVENTS.DSP_FILTER_SAVE,
        //   payload: { name },
        // });
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
