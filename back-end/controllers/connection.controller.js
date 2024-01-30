import OnlineUsersMD from "../models/online_users.model.js"
import UsersMD from "../models/users.model.js"

export const Connect = (socket) => {
  OnlineUsersMD.add(socket.user?.id, (res, err) => {
    if (err) console.log('error online_users connection: ', err)
    else console.log('user connected user_id:', res?.user_id)
  })
}

export const Disconnect = (socket) => {
  OnlineUsersMD.delete(socket.user?.id, (res, err) => {
    if (err) console.log('error online_users disconnection: ', err)
    else console.log('user disconnected user_id:', socket.user?.id)
  })
  UsersMD.lastSeen(socket.user?.id, (res, err) => {
    if (err) console.log('error update last_seen: ', err)
    else console.log('user last_seen success updated: ', res)
  })
}