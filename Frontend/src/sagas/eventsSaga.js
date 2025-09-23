import { call, put, takeEvery } from "redux-saga/effects";
import { api } from "../constants/api";
import axios from "axios";
import MyToast from "../components/Notification/MyToast";
import { addAllEventsToStore } from "../features/eventsSlice";
import { addEventsToStore } from "../features/eventsSlice";
import { deleteEventsFromStore } from "../features/eventsSlice";
import { updateEventsInStore } from "../features/eventsSlice";
import { loading } from "../features/eventsSlice";

function* handleGetEvents(action) {
  yield put(loading(true));

  try {
    const {
      page: currentPage = 1,
      limit = 10,
      search: searchQuery = "",
      filters = {},
    } = action.payload || {};
    const queryParams = new URLSearchParams({
      page: currentPage,
      limit,
      search: searchQuery,
      ...filters,
    }).toString();

    const response = yield call(
      axios.get,
      `${api}/events/all-event?${queryParams}`
    );
    yield put(addAllEventsToStore(response?.data));
  } catch (error) {
    yield put(loading(false));
  }
}
function* handleAddEvents(action) {
  yield put(loading(true));
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = yield call(
      axios.post,
      `${api}/events/create-event`,
      action.payload,
      config
    );

    console.log(response)
    yield put(addEventsToStore(response.data.event));

    MyToast(response.data.message, response.data.success ? "success" : "error");
  } catch (error) {
    yield put(loading(false));
    MyToast(error.response.data.message, "error");
  }
}

function* handleUpdateEvents(action) {
  yield put(loading(true));

  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = yield call(
      axios.put,
      `${api}/events/update/${action.id}`,
      action.payload,
      config
    );

    if (response?.data?.success) {
      const updatedEvent = response.data.event;
      yield put(updateEventsInStore(updatedEvent));
    }

    // if (response?.data?.success) {
    //   const formDataObject = {};
    //   for (const [key, value] of action.payload.entries()) {
    //     formDataObject[key] = value;
    //   }

    //   const updatedEvent = { ...formDataObject, id: response.data.event.id };
    //   yield put(updateEventsInStore(updatedEvent));
    // }

    MyToast(
      response?.data?.message,
      response?.data?.success ? "success" : "error"
    );
  } catch (error) {
    yield put(loading(false));
    MyToast(error.response?.data?.message, "error");
  }
}

function* handleDeleteEvents(action) {
  yield put(loading(true));

  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = yield call(
      axios.delete,
      `${api}/events/delete/${action.payload}`,
      config
    );
    yield put(deleteEventsFromStore(action.payload));

    yield put(loading(false));

    MyToast(response.data.message, response.data.success ? "success" : "error");
  } catch (error) {
    yield put(loading(false));
    MyToast(error.response.data.message, "error");
  }
}

export function* watchEventsSaga() {
  yield takeEvery("events/get-events", handleGetEvents);
  yield takeEvery("events/create-events", handleAddEvents);
  yield takeEvery("events/update-events", handleUpdateEvents);
  yield takeEvery("events/delete-events", handleDeleteEvents);
}
