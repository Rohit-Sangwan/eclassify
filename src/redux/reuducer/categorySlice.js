import { createSelector, createSlice } from "@reduxjs/toolkit";


const initialState = {
    cateData: [],
    catLastPage: 1,
    catCurrentPage: 1,
    categoryView: 'grid',
    SingleCatItem: [],
    SingleCatCurrentPage: 1,
    SingleCatLastPage: 1,
    IsCallCatData: true,
    IsCatHighlighted: false,
    treeData: []
};

export const categorySlice = createSlice({
    name: "Category",
    initialState,
    reducers: {

        setCateData: (state, action) => {
            state.cateData = action.payload;
        },
        resetCateData: (state, action) => {
            return initialState
        },
        replaceAllCateData: (state, action) => {
            state.cateData = action.payload;
        },
        setCatLastPage: (state, action) => {
            state.catLastPage = action.payload
        },
        setCatCurrentPage: (state, action) => {
            state.catCurrentPage = action.payload
        },
        setSingleCatCurrentPage: (state, action) => {
            state.SingleCatCurrentPage = action.payload
        },
        setSingleCatLastPage: (state, action) => {
            state.SingleCatLastPage = action.payload
        },
        setCategoryView: (state, action) => {
            state.categoryView = action.payload
        },
        setSingleCatItem: (state, action) => {
            state.SingleCatItem = action.payload
        },
        setTreeData: (state, action) => {
            state.treeData = action.payload
        },
        setIsCallCatData: (state, action) => {
            state.IsCallCatData = action.payload
        },

        
        // setIsCatHighlighted: (state, action) => {
        //     state.IsCatHighlighted = action.payload
        // },

    },
});

export default categorySlice.reducer;
export const { setCateData, resetCateData, replaceAllCateData, setCatLastPage, setCatCurrentPage, setCategoryView, setSingleCatItem, setSingleCatCurrentPage, setSingleCatLastPage, setTreeData, setIsCallCatData } = categorySlice.actions;

export const CategoryData = createSelector(
    (state) => state.Category,
    (Category) => Category.cateData
)
export const LastPage = createSelector(
    (state) => state.Category,
    (Category) => Category.catLastPage
)
export const CurrentPage = createSelector(
    (state) => state.Category,
    (Category) => Category.catCurrentPage
)
export const SingleCurrentPage = createSelector(
    (state) => state.Category,
    (Category) => Category.SingleCatCurrentPage
)
export const SingleLastPage = createSelector(
    (state) => state.Category,
    (Category) => Category.SingleCatLastPage
)
export const ViewCategory = createSelector(
    (state) => state.Category,
    (Category) => Category.categoryView
)
export const CatItems = createSelector(
    (state) => state.Category,
    (Category) => Category.SingleCatItem
)
// export const HighLightedCategory = createSelector(
//     (state) => state.Category,
//     (Category) => Category.IsCatHighlighted
// )
