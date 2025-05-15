import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import transactionReducer from './slices/transactionSlice';
import authReducer from './slices/authSlice';

// Configure persistence
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['transactions', 'auth'], // only these reducers will be persisted
};

const rootReducer = combineReducers({
  transactions: transactionReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // to avoid non-serializable value errors with redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 