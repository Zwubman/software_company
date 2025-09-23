import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    email: "",
    phone: "+251",
    password: "",
    firstName: "",
    profilePicture: "",
    phoneNumber:"",
    lastName: "",
    verified: false,
  },
  reSendOtpData: {
    email: "",
    phone: "+251",
    password: "",
    firstName: "",
    lastName: "",
    verified: false,
  },
  loading: false,
  loading2: false,
  otpLoading:false,
  isAuthenticated: false,
  success: false,
  message: "",
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loading: (state, action) => {
      state.loading = action.payload;
      state.isAuthenticated = false;
      state.user = initialState.user;
      state.success = false;
      state.message = "";
      state.token = "";
      return state;
    },
    authenticated: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = "";
      state.token ="";
      return state;
    },
    loading2: (state, action) => {
      state.loading2 = action.payload;
      return state;
    },
    addUserToStore: (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
      state.success = action.payload.success;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.message = action.payload.message;
      state.token = action.payload.token;
      return state;
    },
    chageProfileFromStore: (state, action) => {
      state.user.profilePicture = action.payload.profilePicture;
      return state;
    },
    reSendOtpData: (state, action) => {
      state.reSendOtpData = action.payload;
      return state;
    },

    otpLoading: (state, action) => {
      state.otpLoading = action.payload;
      return state;
    },
  },
});
export const { addUserToStore,authenticated, loading ,loading2,otpLoading,reSendOtpData,chageProfileFromStore} = userSlice.actions;
export default userSlice.reducer;
