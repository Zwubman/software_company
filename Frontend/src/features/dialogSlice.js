import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoginDialogOpen: false,
  isRegisterDialogOpen: false,
  isOtpConfirmDialogOpen: false,
  verifyPasswordOtp: false,
  isMobileView: false,
  resetPassword: false,
  inputPassword: false,
  email: "",

};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    toogleLoginDialog: (state, action) => {
      state.isLoginDialogOpen = action.payload;
      state.isRegisterDialogOpen = false;
      state.isOtpConfirmDialogOpen = false;
      return state;
    },

    toogleRegisterDialog: (state, action) => {
      state.isRegisterDialogOpen = action.payload;
      state.isLoginDialogOpen = false;
      state.isOtpConfirmDialogOpen = false;
      return state;
    },
    toogleOtpConfirmDialog: (state, action) => {
      state.isOtpConfirmDialogOpen = action.payload;
      state.isLoginDialogOpen = false;
      state.isRegisterDialogOpen = false;
      return state;
    },
    toggleMoblieView: (state, action) => {
      state.isMobileView = action.payload;
      return state;
    },
    toggleResetPassword: (state, action) => {
      state.resetPassword = action.payload;
      return state;
    },
    toggleInputPassword: (state, action) => {
      state.inputPassword = action.payload;
      return state;
    },
    toggleVerifyPasswordOtp:(state, action) => {
      state.verifyPasswordOtp = action.payload;
      return state;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
      return state;
    },
    closeAllDialog: (state) => {
      state.isLoginDialogOpen = false;
      state.isRegisterDialogOpen = false;
      state.isOtpConfirmDialogOpen = false;
      state.isMobileView = false;
      state.resetPassword = false;
      return state;
    },
  },
});
export const {
  toogleLoginDialog,
  toogleRegisterDialog,
  toogleOtpConfirmDialog,
  toggleResetPassword,
  toggleInputPassword,
  toggleVerifyPasswordOtp,
  setEmail,
} = dialogSlice.actions;

export default dialogSlice.reducer;
