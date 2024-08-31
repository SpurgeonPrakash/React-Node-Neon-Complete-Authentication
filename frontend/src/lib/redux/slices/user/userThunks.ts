import { createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

export const getUser = createAsyncThunk(
  "user/getUser",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (headers: any = {}, thunkAPI) => {
    try {
      return await userService.getUser(headers);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    return await userService.logout();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});
