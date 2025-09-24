import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
const sagaMiddleware = createSagaMiddleware();
import userReducer from "./features/userSlice";
import dialogReducer from "./features/dialogSlice";
import newsReducer from "./features/newsSlice";
import eventsReducer from "./features/eventsSlice";
import routeReducer from "./features/routeSlice"
const store = configureStore({
  reducer: {
    userData: userReducer,
    dialogData: dialogReducer,
    newsData: newsReducer,
    eventData: eventsReducer,
    routerData:routeReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
