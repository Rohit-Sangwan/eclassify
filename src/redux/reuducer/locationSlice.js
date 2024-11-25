import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";


const initialState = {
    cityData: {
        city: "",
        state: "",
        country: "",
        lat: "",
        long: ""
    },
    KilometerRange: 0,
    IsBrowserSupported: false
}
export const locationSlice = createSlice({
    name: "Location",
    initialState,
    reducers: {

        setCityData: (location, action) => {
            location.cityData = action.payload.data;
        },
        setIsBrowserSupported: (location, action) => {
            location.IsBrowserSupported = action.payload;
        },
        setKilometerRange: (location, action) => {
            location.KilometerRange = action.payload;
        },
    },
});

export default locationSlice.reducer;
export const { setCityData, setIsBrowserSupported, setKilometerRange } = locationSlice.actions;



// Action to store location 
export const saveCity = (data) => {
    store.dispatch(setCityData({ data }));
}

export const getCityData = createSelector(
    (state) => state.Location,
    (Location) => Location.cityData
)
export const getKilometerRange = createSelector(
    (state) => state.Location,
    (Location) => Location.KilometerRange
)
export const getIsBrowserSupported = createSelector(
    (state) => state.Location,
    (Location) => Location.IsBrowserSupported
)
