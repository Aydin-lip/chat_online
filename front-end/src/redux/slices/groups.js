import { createSlice } from '@reduxjs/toolkit'

const groupsSlice = createSlice({
  name: 'groupsSlice',
  initialState: {
    groups: []
  },
  reducers: {
    setGroups(state, action) {
      state.groups = action.payload
    },
    addGroup(state, action) {
      state.groups = [...state.groups, action.payload]
    },
    removeGroup(state, action) {
      state.groups = state.groups.filter(u => u.id !== action.payload)
    },
    editGroup(state, action) {
      const id = action.payload?.id
      const groups = state.groups
      if (id) {
        const idx = groups.indexOf(groups.find(g => g.id == id))
        groups.splice(idx, 1, action.payload.group)
        state.groups = groups
      }
    },
    seenLastMessageGroup(state, action) {
      const { user_id, id } = action.payload
      const group = state.groups.find(u => u.id == id)
      if (group) {
        const allSeen = JSON.parse(group.lastMessage.seen)
        allSeen.push(user_id)
        const changed = {
          ...group,
          lastMessage: {
            ...group.lastMessage,
            seen: allSeen
          }
        }
        editGroup({ id, group: changed })
      }
    },
    changeLastMessageGroup(state, action) {
      const { user_id, message } = action.payload
      const { groups } = state
      const user = groups.find(u => u.id == message.ref_id)
      if (user) {
        const changed = {
          ...user,
          lastMessage: message
        }
        console.log(message.user_id, user_id)
        if (message.user_id != user_id)
          changed.notSeenMessages = user.notSeenMessages + 1
        // editUser({ id, user: changed })
        const idx = groups.indexOf(groups.find(u => u.id == message.ref_id))
        groups.splice(idx, 1, changed)
        state.groups = groups
      }
    },
  }
})

export const { changeLastMessageGroup, seenLastMessageGroup, changeActive, editGroup, removeGroup, addGroup, setGroups } = groupsSlice.actions
export default groupsSlice.reducer