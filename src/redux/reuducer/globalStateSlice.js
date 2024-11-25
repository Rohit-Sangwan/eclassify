import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";

const initialState = {
    chatState: {
        chatAudio: {}
    }
};

export const globalStateSlice = createSlice({
    name: "GlobalState",
    initialState,
    reducers: {
        setChatAudio: (state, action) => {
            state.chatState.chatAudio = action.payload?.data;
        },
    },
});

export default globalStateSlice.reducer;
export const { setChatAudio } = globalStateSlice.actions;

export const loadChatAudio = (data) => {
    store.dispatch(setChatAudio({ data }));
}

// create selector
export const getGlobalStateData = createSelector(
    (state) => state.GlobalState,
    (GlobalState) => GlobalState
);
