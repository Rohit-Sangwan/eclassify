import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";


const initialState = {
    data: [],
    chatOffer: {}
};

export const offerSlice = createSlice({
    name: "OfferData",
    initialState,
    reducers: {

        setOfferData: (offer, action) => {
            offer.data = action.payload.data;
        },
        setChatOffer: (offer, action) => {
            offer.chatOffer = action.payload.data;
        }

    },
});

export default offerSlice.reducer;
export const { setOfferData, setChatOffer } = offerSlice.actions;



// Action to store location 
export const saveOfferData = (data) => {
    store.dispatch(setOfferData({ data }));
}

// Action to store location 
export const savechatOfferData = (data) => {
    store.dispatch(setChatOffer({ data }));
}


// selecteors 
export const getOfferData = createSelector(
    (state) => state.OfferData,
    (OfferData) => OfferData.data
)

// selecteors 
export const getChatOfferData = createSelector(
    (state) => state.OfferData,
    (OfferData) => OfferData.chatOffer
)


