import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './slices/transactionSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 