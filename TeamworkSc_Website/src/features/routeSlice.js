import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    route:""
};

const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {
   
    addrouteToStore: (state, action) => {
      state.route = action.payload;
      
      return state;
    },
  },
});
export const { addrouteToStore} = routeSlice.actions;
export default routeSlice.reducer;
