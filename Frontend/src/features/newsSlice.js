import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  news: [],
  loading: false,
  success: false,
  message: "",
  totalNews: 0,
  todayNews: 0,
  thisWeekNews: 0,
  thisMonthNews: 0,
  page:1
};


const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    loading: (state, action) => {
      state.loading = action.payload;
      state.success = false;
      state.message = "";
      return state;
    },
    addAllNewsToStore: (state, action) => {
      state.news = action.payload.news;
      state.loading = false;
      state.totalNews = action.payload.statistics.totalNews;
      state.todayNews = action.payload.statistics.todayNews;
      state.thisWeekNews = action.payload.statistics.thisWeekNews;
      state.thisMonthNews = action.payload.statistics.thisMonthNews;

      state.page = action.payload.statistics.page;
      state.success = action.payload.success;
      state.message = action.payload.message;
      return state;
    },
    addNewsToStore: (state, action) => {
      state.news = [action.payload.news, ...state.news];
      state.loading = false;
      state.todayNews = state.todayNews + 1;
      state.thisWeekNews = state.thisWeekNews + 1;
      state.thisMonthNews = state.thisMonthNews + 1;
      state.totalNews = state.totalNews + 1;
      state.success = action.payload.success;
      state.message = action.payload.message;
      return state;
    },
    deleteNewsFromStore: (state, action) => {
      state.news = state.news.filter((news) => news.id !== action.payload);
      state.loading = false;
      state.totalNews = state.totalNews>0&&state.totalNews - 1;
      state.todayNews = state.todayNews>0&&state.todayNews - 1;
      state.thisWeekNews = state.thisWeekNews>0&&state.thisWeekNews - 1;
      state.thisMonthNews = state.thisMonthNews>0&&state.thisMonthNews - 1;
      return state;
    },
    updateNewsInStore: (state, action) => {
      const updatedNews = state.news.map((news) =>
        news.id === action.payload.id ? action.payload : news
      );
      state.news = updatedNews;
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
      return state;
    },
  },
});
export const { addNewsToStore,updateNewsInStore, loading,addAllNewsToStore ,deleteNewsFromStore} = newsSlice.actions;
export default newsSlice.reducer;