import { createSlice } from "@reduxjs/toolkit";

import { getUser, logout } from "./userThunks";
import { User } from "../../../../types/shared.types";
import {
  LOCAL_REFRESH_EXPIRY_NAME,
  LOGOUT_PENDING_KEY,
  REFRESH_TOKEN_EXPIRY_MINUS_ONE_MINUTE,
} from "../../../../config";

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  loadingStatus: "idle" | "pending" | "fulfilled" | "rejected";
  message: string;
  tokenExpiration: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  user: null,
  loadingStatus: "pending",
  message: "",
  tokenExpiration: localStorage.getItem(LOCAL_REFRESH_EXPIRY_NAME),
};

// Then, handle actions in your reducers:
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.loadingStatus = "fulfilled";
      const expirySpan = REFRESH_TOKEN_EXPIRY_MINUS_ONE_MINUTE;
      const expiryDate = new Date(
        new Date().getTime() + expirySpan
      ).toISOString();
      localStorage.setItem(LOCAL_REFRESH_EXPIRY_NAME, expiryDate);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loadingStatus = "pending";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loadingStatus = "fulfilled";
        state.isLoggedIn = true;
        if (!state.tokenExpiration) {
          const expirySpan = REFRESH_TOKEN_EXPIRY_MINUS_ONE_MINUTE;
          const expiryDate = new Date(
            new Date().getTime() + expirySpan
          ).toISOString();
          localStorage.setItem(LOCAL_REFRESH_EXPIRY_NAME, expiryDate);
          state.tokenExpiration = expiryDate;
        }
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loadingStatus = "rejected";
        state.message = action.payload as string;
        state.isLoggedIn = false;
        state.user = null;
      });

    builder
      .addCase(logout.pending, (state) => {
        state.loadingStatus = "pending";
      })
      .addCase(logout.fulfilled, (state) => {
        state.loadingStatus = "fulfilled";
        state.isLoggedIn = false;
        state.user = null;
        state.tokenExpiration = null;
        localStorage.removeItem(LOCAL_REFRESH_EXPIRY_NAME);
        localStorage.removeItem(LOGOUT_PENDING_KEY);
      })
      .addCase(logout.rejected, (state, action) => {
        state.loadingStatus = "rejected";
        state.message = action.payload as string;
        state.isLoggedIn = false;
        state.user = null;
        localStorage.setItem(LOGOUT_PENDING_KEY, "true");
      });
  },
});

export const userActions = usersSlice.actions;

export default usersSlice.reducer;
