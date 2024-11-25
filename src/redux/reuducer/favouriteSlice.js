import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";


const initialState = {
    data: {
        id: "",
        isLiked: false
    }
};

export const favouriteSlice = createSlice({
    name: "Favourite",
    initialState,
    reducers: {
        setFavData: (state, action) => {
            state.data = action.payload;
        },
    },
});

export default favouriteSlice.reducer;
export const { setFavData } = favouriteSlice.actions;


export const saveFavData = (data) => {
    store.dispatch(setFavData({ data }));
}

// create selector
export const getFavData = createSelector(
    (state) => state.Favourite,
    (Favourite) => Favourite.data
)


