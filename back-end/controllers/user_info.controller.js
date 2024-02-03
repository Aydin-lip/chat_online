import UsersMD from "../models/users.model.js"

export const GetUserCustomInfo = (socket, user_id, attributes) => {
  UsersMD.getUserCustomInfo(user_id, attributes, (res, err) => {
    if (res)
      socket.emit('Get_User_Custom_Info', res)
    else
      socket.emit('error', { path: 'Get_User_Custom_Info', message: 'Error in get user custom info!', error: err })
  })
}

export const GetUsersCustomInfo = (socket, ids, attributes, page = 1, pageSize = 20) => {
  UsersMD.getUsersCustomInfo(ids, attributes, { page, pageSize }, (res, err) => {
    if (res)
      socket.emit('Get_Users_Custom_Info', res)
    else
      socket.emit('error', { path: 'Get_Users_Custom_Info', message: 'Error in get users custom info!', error: err })
  })
}