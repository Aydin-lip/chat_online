import { createSlice } from '@reduxjs/toolkit'

const usersSlice = createSlice({
  name: 'usersSlice',
  initialState: {
    users: []
  },
  reducers: {
    setUsers(state, action) {
      state.users = action.payload
    },
    addUser(state, action) {
      state.users = [...state.users, action.payload]
    },
    deleteUser(state, action) {
      state.users = state.users.filter(u => u.id !== action.payload)
    },
    editUser(state, action) {
      const id = action.payload?.id
      const { users } = state
      if (id) {
        const firstStep = users.filter(u => u.id > id)
        const lastStep = users.filter(u => u.id < id)
        state.users = [...firstStep, action.payload.user, ...lastStep]
      }
    },
    changeActiveUser(state, action) {
      const { id, active } = action.payload
      const user = state.users.find(u => u.id == id)
      if (user) {
        this.editUser({ id, user: { ...user, online: active } })
      }
    },
    seenLastMessageUser(state, action) {
      const seen = action.payload
      state.users = state.users.map(user =>
        seen.includes(user.lastMessage?.id) ?
          ({ ...user, lastMessage: { ...user.lastMessage, seen: [...user.lastMessage.seen, user.user_id] } })
          : user
      )
    },
    changeLastMessageUser(state, action) {
      const { id, message } = action.payload
      const user = state.users.find(u => u.id == id)
      if (user) {
        const changed = {
          ...user,
          lastMessage: message
        }
        this.editUser({ id, user: changed })
      }
    },
    changeNotSeenMessages(state, action) {
      const { seen, ref_id } = action.payload
      state.users.map(user => user.id === ref_id ? ({
        ...user,
        notSeenMessages: user.notSeenMessages - seen.length
      }) : user)
    }
  }
})

export const { changeLastMessageUser, seenLastMessageUser, changeActiveUser, editUser, deleteUser, addUser, setUsers } = usersSlice.actions
export default usersSlice.reducer