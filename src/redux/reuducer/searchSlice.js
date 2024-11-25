import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchQuery: '',
    serachTag:""
}

export const searchSlice = createSlice({
    name: "Search",
    initialState,
    reducers: {
        setSearch: (state, action) => {
            state.searchQuery = action.payload
        },
        setSearchTag:(state, action) => {
            state.serachTag = action.payload
        }
    }
})

export default searchSlice.reducer;
export const { setSearch, setSearchTag } = searchSlice.actions

export const SearchData = createSelector(
    (state) => state.Search,
    (Search) => Search.searchQuery
)
export const searchedTag = createSelector(
    (state) => state.Search,
    (Search) => Search.serachTag
)