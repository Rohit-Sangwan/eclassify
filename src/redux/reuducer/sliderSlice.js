import { createSelector, createSlice } from "@reduxjs/toolkit";


const initialState = {
    slider: []
};

export const sliderSlice = createSlice({
    name: "Slider",
    initialState,
    reducers: {
        setSlider: (state, action) => {
            state.slider = action.payload;
        },
    },
});

export default sliderSlice.reducer;
export const { setSlider } = sliderSlice.actions;
export const SliderData = createSelector(
    (state) => state.Slider,
    (Slider) => Slider.slider
)


