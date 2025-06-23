import { createSlice } from "@reduxjs/toolkit"


const appSlice = createSlice({
  name: 'app',
  initialState: {
    openSideMenu: false
  },
  reducers: {
    setOpenSideMenu: (state, action) => {
      state.openSideMenu = action.payload;
    },
  },
});


export const { setOpenSideMenu } = appSlice.actions;
export default appSlice.reducer;