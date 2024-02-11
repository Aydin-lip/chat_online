import OnlineUsersMD from "../models/online_users.model.js"

export const SelectChat = (socket, id) => {
  OnlineUsersMD.selectChat(socket.user?.id, id)
}
