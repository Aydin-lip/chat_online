import { createSlice } from '@reduxjs/toolkit'

const messagesSlice = createSlice({
  name: 'messagesSlice',
  initialState: {
    messages: []
  },
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload
    },
    addNewMessage(state, action) {
      const { user_id, message } = action.payload
      console.log()
      if (((state.messages[0]?.ref_id ?? 0) == message.ref_id) || (user_id == message.user_id)) {
        state.messages = [...state.messages, message]
      }
    },
    deleteMessage(state, action) {
      state.messages = state.messages.filter(msg => msg.id !== action.payload)
    },
    editMessage(state, action) {
      const id = action.payload?.id
      const { messages } = state
      if (id) {
        const firstStep = messages.filter(msg => msg.id > id)
        const lastStep = messages.filter(msg => msg.id < id)
        state.messages = [...firstStep, action.payload.message, ...lastStep]
      }
    },
    seenMessages(state, action) {
      const { seen, user_id } = action.payload
      state.messages = state.messages.map(msg => seen.includes(msg.id) ? ({ ...msg, seen: [...msg.seen, user_id] }) : msg)
    }
  }
})

export const { setMessages, addNewMessage, deleteMessage, editMessage, seenMessages } = messagesSlice.actions
export default messagesSlice.reducer