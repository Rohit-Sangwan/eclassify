import { createSelector, createSlice } from "@reduxjs/toolkit";


const initialState = {
    BreadcrumbPath: [],
};

export const breadCrumbSlice = createSlice({
    name: "BreadcrumbPath",
    initialState,
    reducers: {
        setBreadcrumbPath: (state, action) => {
            state.BreadcrumbPath = action.payload;
        },
        
        resetBreadcrumb: (state, action) => {
            return initialState
        }
    },
});

export default breadCrumbSlice.reducer;
export const { setBreadcrumbPath, resetBreadcrumb } = breadCrumbSlice.actions;

// export const BreadcrumbPathData = createSelector(
//     (state) => state.BreadcrumbPath.BreadcrumbPath
// )


export const BreadcrumbPathData = createSelector(
    (state) => state.BreadcrumbPath,
    (BreadcrumbPath) => BreadcrumbPath.BreadcrumbPath
);

