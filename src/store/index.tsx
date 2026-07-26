import { configureStore } from "@reduxjs/toolkit";
import { socketMiddleware } from "./socketMiddleware";
import { toastMiddleware } from "./toastMiddleware";
import { rootReducer } from "./reducers";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({
      immutableCheck: { warnAfter: 256 },
      serializableCheck: { warnAfter: 256 },
    }).concat(socketMiddleware, toastMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;