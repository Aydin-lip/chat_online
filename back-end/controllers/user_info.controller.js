import UsersMD from "../models/users.model.js"

export const GetCustomInfo = (socket, user_id, attributes) => {
  UsersMD.getUserCustomInfo(user_id, attributes, (res, err) => {
    if (res)
      socket.emit('Get_User_Custom_Info', res)
    else
      socket.emit('error', { path: 'Get_User_Custom_Info', message: 'Error in get user custom info!', error: err })
  })
} 