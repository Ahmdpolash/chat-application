import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedUser(state, action) {
      const { user, accessToken } = action.payload;
      state.token = accessToken;
      state.user = user;
    },

    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loggedUser } = authSlice.actions;
export default authSlice.reducer;
