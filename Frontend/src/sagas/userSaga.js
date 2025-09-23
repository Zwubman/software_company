import { call, put, takeEvery } from "redux-saga/effects";
import { api } from "../constants/api";
import axios from "axios";
import {
  addUserToStore,
  loading,
  loading2,
  otpLoading,
  reSendOtpData,
} from "../features/userSlice";
import MyToast from "../components/Notification/MyToast";

function* handleLogin(action) {
  // yield put(loading(true));

  try {
    const response = yield call(
      axios.post,
      // `${api}/api/users/login`,
      `${api}/auth/login`,
      action.formData
    );

    const token = yield response?.data?.accessToken;
    if (token) {
      localStorage.setItem("token", token);
    }
    response?.data?.success &&
      (response.data = {
        ...response.data,
        isAuthenticated: true,
      });
    yield put(addUserToStore(response.data));
    MyToast(response.data.message, response.data.success ? "success" : "error");
    action.setIsLoading(false);

    response.data.success && action.callback();
  } catch (error) {
    yield put(loading(false));
    action.setIsLoading(false);
    action.setError(error?.response?.data?.message || "network error");
    // MyToast(error.response.data.message, "error");
  }
}
export function* handleRegister(action) {
  yield put(loading2(true));

  try {
    const { firstName, lastName, email, phone, password } = action.formData;
    const name = firstName + " " + lastName;
    const phoneNumber = "+" + phone;
    const values = { name, email, phoneNumber: phoneNumber, password };
    const response = yield call(axios.post, `${api}/auth/send-otp`, values);
    response.data = { ...response.data, email };
    yield put(reSendOtpData(action.formData));
    yield put(addUserToStore(response.data));
    MyToast(response.data.message, response.data.success ? "success" : "error");
    response.data.success && action.handleConfirmOtp();
    yield put(loading2(false));
  } catch (error) {
    yield put(loading(false));
    yield put(loading2(false));
    action.setError(error.response.data.message || "network error");
  } finally {
    yield put(loading(false));
    yield put(loading2(false));
  }
}

export function* checkUser() {
  try {
    const tokenn = localStorage.getItem("token");
    const headers = tokenn ? { Authorization: `Bearer ${tokenn}` } : {};

    yield put(loading(true));

    const response = yield call(axios.get, `${api}/auth/check-auth`, {
      headers: headers,
    });

    const { accessToken, success } = yield response.data;
    if (!success) {
      MyToast(
        response?.data.message,
        response.data.success ? "success" : "error"
      );
    }

    if (accessToken) {
      localStorage.setItem("token", accessToken);
    }
    response.data.success &&
      (response.data = {
        ...response.data,
        isAuthenticated: true,
      });
    yield put(addUserToStore(response.data));
  } catch (error) {
    yield put(loading(false));
  }
}

export function* verifyOtp(action) {
  yield put(otpLoading(true));
  try {
    const { email } = action.formData;
    const { otp } = action.formData.values;
    const response = yield call(axios.post, `${api}/auth/verify-otp`, {
      otp,
      email,
    });
    yield put(otpLoading(false));
    MyToast(
      response.data?.message,
      response.data?.success ? "success" : "error"
    );
    response.data?.success && action.callback();
  } catch (error) {
    yield put(otpLoading(false));
    action.setError(error.response.data?.message || "network error");
    // MyToast(error.response.data?.message, "error");
  }
}

export function* watcUserSaga() {
  yield takeEvery("user/login", handleLogin);
  yield takeEvery("user/register", handleRegister);
  yield takeEvery("user/check-auth", checkUser);
  yield takeEvery("user/verify-otp", verifyOtp);
}
