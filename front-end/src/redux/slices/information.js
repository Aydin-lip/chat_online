import { createSlice } from '@reduxjs/toolkit'

const informationSlice = createSlice({
  name: 'informationSlice',
  initialState: {
    info: {}
  },
  reducers: {
    setInformation(state, action) {
      state.info = action.payload
    }
  }
})

export const { setInformation } = informationSlice.actions
export default informationSlice.reducer