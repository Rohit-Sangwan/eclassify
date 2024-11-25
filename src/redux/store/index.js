import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import settingsReducer from "../reuducer/settingSlice";
import sliderReducer from '../reuducer/sliderSlice';
import categoryReducer from '../reuducer/categorySlice'
import userReducer from '../reuducer/userSlice';
import BreadcrumbPathReducer from '../reuducer/breadCrumbSlice'
import CurrentLanguageReducer from '../reuducer/languageSlice'
import locationReducer from '../reuducer/locationSlice';
import offerReducer from '../reuducer/offerSlice';
import favouriteReducer from '../reuducer/favouriteSlice';
import searchReducer from "../reuducer/searchSlice"
import globalStateReducer from '../reuducer/globalStateSlice';

const persistConfig = {
  key: 'root',
  storage,
  manualPersisting: true,
};


const rootReducer = combineReducers({
  Settings: settingsReducer,
  Slider: sliderReducer,
  Category: categoryReducer,
  UserSignup: userReducer,
  BreadcrumbPath: BreadcrumbPathReducer,
  CurrentLanguage: CurrentLanguageReducer,
  Location: locationReducer,
  OfferData: offerReducer,
  Favourite: favouriteReducer,
  Search: searchReducer,
  GlobalState: globalStateReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});

export const persistor = persistStore(store);
