import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/profileSlice";
import appointmentsReducer from "./slices/appointmentsSlice"
export const store = configureStore({
  reducer: {
    profile: profileReducer,
    appointments: appointmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
