import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";

const initialState = {
    data: null,
    lastFetch: null,
    loading: false,
    fcmToken: null,
};

export const settingsSlice = createSlice({
    name: "Settings",
    initialState,
    reducers: {
        settingsRequested: (settings) => {
            settings.loading = true;
        },
        settingsSucess: (settings, action) => {
            let { data } = action.payload;
            settings.data = data;
            settings.loading = false;
            settings.lastFetch = Date.now();
        },
        settingsFailure: (settings) => {
            settings.loading = false;
        },
        getToken: (settings, action) => {
            settings.fcmToken = action.payload.data;
        },
        
    },
});

export const { settingsRequested, settingsSucess, settingsFailure, getToken } = settingsSlice.actions;
export default settingsSlice.reducer;

// Action to store token 
export const getFcmToken = (data) => {
    store.dispatch(getToken({ data }));
}


// Selectors
export const settingsData = createSelector(
    (state) => state.Settings,
    (settings) => settings.data
);

export const Fcmtoken = createSelector(
    state => state.Settings,
    settings => settings?.fcmToken
);

