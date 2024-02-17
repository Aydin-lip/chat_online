import { configureStore } from '@reduxjs/toolkit'
import informationSlice from './slices/information'
import messagesSlice from './slices/messages'
import usersSlice from './slices/users'
import groupsSlice from './slices/groups'

const Store = configureStore({
  reducer: {
    information: informationSlice,
    messages: messagesSlice,
    users: usersSlice,
    groups: groupsSlice
  }
})

export default Store