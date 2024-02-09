import GroupsMD from "../models/groups.model.js"

export const GetGroupCustomInfo = (socket, group_id, attributes = ['owner', 'admins', 'name', 'profile', 'description', 'members', 'online_members']) => {
  GroupsMD.getGroupCustomInfo(group_id, attributes, (res, err) => {
    if (res)
      socket.emit('Get_Group_Custom_Info', res)
    else
      socket.emit('error', { path: 'Get_Group_Custom_Info', message: 'Error in get group custom info!', error: err })
  })
} 