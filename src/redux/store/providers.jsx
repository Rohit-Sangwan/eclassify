//provider.js
"use client";
import { Provider } from "react-redux";
import { persistor, store } from "."
import { PersistGate } from "redux-persist/integration/react";
export function Providers({ children }) {
  return <Provider store={store} >
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>;
}