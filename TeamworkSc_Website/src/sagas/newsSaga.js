import { call, put, takeEvery } from "redux-saga/effects";
import { api } from "../constants/api";
import axios from "axios";
import { addNewsToStore, loading ,addAllNewsToStore, updateNewsInStore, deleteNewsFromStore} from "../features/newsSlice";
import MyToast from "../components/Notification/MyToast";

function* handleGetNews(action) {
  yield put(loading(true));

  try {
    const { page: currentPage = 1, limit = 10, search: searchQuery = '', filters = {} } = action.payload || {};
    const queryParams = new URLSearchParams({
      page: currentPage,
      limit,
      search: searchQuery,
      ...filters
    }).toString();


    const response = yield call(axios.get, `${api}/news/all-news?${queryParams}`);
    yield put(addAllNewsToStore(response?.data));

  } catch (error) {
    yield put(loading(false));
    // MyToast(error.response.message||"failed to fetch news", "error");
  }
}
function* handleAddNews(action) {
  yield put(loading(true));

  try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    const response = yield call(axios.post, `${api}/news/create-news`, action.payload, config);

    yield put(addNewsToStore(response.data));

    MyToast(response.data.message, response.data.success ? "success" : "error");
  } catch (error) {
    yield put(loading(false));
    MyToast(error.response.data.message, "error");
  }
}

function* handleUpdateNews(action) {
  yield put(loading(true));

  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    let payload;
    
    // Handle different payload structures
    if (action.payload.formData) {
      // If formData is provided (from News.jsx)
      payload = action.payload.formData;
    } else {
      // If individual fields are provided (from AdminNews.jsx)
      const formData = new FormData();
      
      // Add text fields
      if (action.payload.title) formData.append('title', action.payload.title);
      if (action.payload.content) formData.append('content', action.payload.content);
      if (action.payload.category) formData.append('category', action.payload.category);
      if (action.payload.author) formData.append('author', action.payload.author);
      if (action.payload.deadline) formData.append('deadline', action.payload.deadline);
      if (action.payload.readTime) formData.append('readTime', action.payload.readTime);
      
      // Add image files
      if (action.payload.picture && Array.isArray(action.payload.picture)) {
        action.payload.picture.forEach((file) => {
          formData.append('picture', file);
        });
      }
      
      payload = formData;
    }

    const response = yield call(axios.put, `${api}/news/update-news/${action.payload.id}`, payload, config);
    yield put(updateNewsInStore(response.data.news));
    MyToast(response.data.message, response.data.success ? "success" : "error");
  } catch (error) {
    yield put(loading(false));
    MyToast(error.response?.data?.message || "Failed to update news", "error");
  }
}


function* handleDeleteNews(action) {
  yield put(loading(true));

  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = yield call(axios.delete, `${api}/news/delete-news/${action.payload}`, config);
    yield put(deleteNewsFromStore(action.payload));

    yield put(loading(false));

    MyToast(response.data.message, response.data.success ? "success" : "error");
  } catch (error) {
    yield put(loading(false));
    MyToast(error.response.data.message, "error");
  }
}


export function* watchNewsSaga() {
    yield takeEvery("news/get-news", handleGetNews);
  yield takeEvery("news/create-news", handleAddNews);
  yield takeEvery("news/update-news", handleUpdateNews);
  yield takeEvery("news/delete-news", handleDeleteNews);

}

