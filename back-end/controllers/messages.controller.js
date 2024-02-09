import MessagesMD from "../models/messages.model.js"

export const SeenMessages = (socket, ids) => {
  MessagesMD.addSeen(ids, socket.user?.id, (res, err) => {
    if (!err) {
      socket.emit('Seen_Messages', { message_ids: ids, message: 'Success seen.' })
    } else {
      socket.emit('error', { path: 'Seen_Messages', message: 'Error in seen messages!', error: err })
    }
  })
}