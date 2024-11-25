import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
    language: {},
};

export const languageSlice = createSlice({
    name: "CurrentLanguage",
    initialState,
    reducers: {
        setCurrentLanguage: (state, action) => {
            state.language = action.payload;
        },
        resetCurrentLanguage: (state, action) => {
            state.language = action.payload;
        },
    },
});

export default languageSlice.reducer;
export const { setCurrentLanguage,resetCurrentLanguage } = languageSlice.actions;

export const CurrentLanguageData = createSelector(
    (state) => state.CurrentLanguage,
    (CurrentLanguage) => CurrentLanguage.language
);
