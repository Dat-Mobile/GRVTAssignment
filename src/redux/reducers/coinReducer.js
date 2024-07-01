import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

export const coinReducerSlice = createSlice({
  name: 'coinReducer',
  initialState: {
    isLoading: false,
    isUpdating: false,
    coinList: [],
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsUpdating: (state, action) => {
      state.isUpdating = action.payload;
    },
    setCoinList: (state, action) => {
      state.coinList = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setIsLoading, setIsUpdating, setCoinList} =
  coinReducerSlice.actions;

export default coinReducerSlice.reducer;
