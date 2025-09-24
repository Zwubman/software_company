
import { all } from "redux-saga/effects";
import { watcUserSaga } from "./userSaga";
import { watchNewsSaga } from "./newsSaga";
import { watchEventsSaga } from "./eventsSaga";
export default function* rootSaga() {
  yield all([
    watcUserSaga(),
    watchNewsSaga(),
    watchEventsSaga()
  ]);
}