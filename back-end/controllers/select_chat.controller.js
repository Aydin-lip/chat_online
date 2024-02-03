import MessagesMD from "../models/messages.model.js"
import OnlineUsersMD from "../models/online_users.model.js"

export const SelectChat = (socket, id) => {
  MessagesMD.getByRefId(id, { page: 1, pageSize: 10 }, (res, err) => {
    if (res) {
      OnlineUsersMD.selectChat(socket.user?.id, id)
      socket.emit('Get_Select_Chat_Messages', res)
    } else
      socket.emit('error', { path: 'Get_Select_Chat_Messages', message: 'Have a problem in get select chat messages!', error: err })
  })
}
