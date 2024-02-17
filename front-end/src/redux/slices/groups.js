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
    seenLastMessage(state, action) {
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
        this.editGroup({ id, group: changed })
      }
    },
    changeLastMessage(state, action) {
      const { id, message } = action.payload
      const group = state.groups.find(u => u.id == id)
      if (group) {
        const changed = {
          ...group,
          lastMessage: message
        }
        this.editGroup({ id, group: changed })
      }
    },
  }
})

export const { changeLastMessage, seenLastMessage, changeActive, editGroup, removeGroup, addGroup, setGroups } = groupsSlice.actions
export default groupsSlice.reducer