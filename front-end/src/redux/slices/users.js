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
    changeActive(state, action) {
      const { id, active } = action.payload
      const user = state.users.find(u => u.id == id)
      if (user) {
        this.editUser({ id, user: { ...user, online: active } })
      }
    },
    seenLastMessage(state, action) {
      const { seen, id } = action.payload
      const user = state.users.find(u => u.id == id)
      if (user) {
        const allSeen = JSON.parse(user.lastMessage.seen)
        seen.includes(user.lastMessage.id) && allSeen.push(user.user_id)
        const changed = {
          ...user,
          lastMessage: {
            ...user.lastMessage,
            seen: allSeen
          }
        }
        this.editUser({ id, user: changed })
      }
    },
    changeLastMessage(state, action) {
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

  }
})

export const { changeLastMessage, seenLastMessage, changeActive, editUser, deleteUser, addUser, setUsers } = usersSlice.actions
export default usersSlice.reducer