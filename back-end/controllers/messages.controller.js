import ChatsMD from "../models/chats.model.js"
import GroupsMD from "../models/groups.model.js"
import MessagesMD from "../models/messages.model.js"
import OnlineUsersMD from "../models/online_users.model.js"
import UsersMD from "../models/users.model.js"
import { AddNewMessageValidation } from "../validations/messages.validation.js"

export const SeenMessages = (io, socket, messages_id, ref_id) => {
  MessagesMD.addSeen(messages_id, socket.user?.id, (res, err) => {
    if (!err) {
      GroupsMD.getGroupCustomInfo(ref_id, ['online_members'], (resOU, errOU) => {
        if (!errOU) {
          if (resOU)
            resOU.online_members_socket.map(id => {
              io.to(id).emit('Seen_Messages', { seen_messages_id: res.seen, ref_id, message: 'Success seen.' })
            })
          else {
            ChatsMD.getById(ref_id, ({ dataValues }, errC) => {
              if (!errC) {
                if (dataValues) {
                  [dataValues.user_2, dataValues.user_1].forEach(id => {
                    io.to(id).emit('Seen_Messages', { seen_messages_id: res.seen, message: 'Success seen.' })
                  })
                } else {
                  socket.emit('error', { path: 'Seen_Message', message: 'not found chat for user_id!', error: errC })
                }
              } else {
                socket.emit('error', { path: 'Seen_Messages', message: 'Error in get chat for user_id!', error: errC })
              }
            })
          }
        } else {
          socket.emit('error', { path: 'Seen_Messages', message: 'Error for send message get online users!', error: errOU })
        }
      })
    } else {
      socket.emit('error', { path: 'Seen_Messages', message: 'Error in seen messages!', error: err })
    }
  })
}

export const SendMessage = (io, socket, data) => {
  AddNewMessageValidation.validate(data, { abortEarly: false })
    .then(resV => {
      const message = new MessagesMD({ ...data, user_id: socket.user?.id })
      message.add((res, err) => {
        if (!err) {
          const { firstname, lastname, avatar } = socket.user
          GroupsMD.getGroupCustomInfo(data.ref_id, ['online_members'], (resOU, errOU) => {
            if (!errOU) {
              if (resOU)
                resOU.online_members_socket.map(id => {
                  io.to(id).emit('New_Message', {
                    message: { user: { firstname, lastname, avatar }, ...res }
                  })
                })
              else {
                ChatsMD.getById(data.ref_id, (resC, errC) => {
                  const dataValues = resC?.dataValues
                  if (!errC) {
                    if (dataValues) {
                      OnlineUsersMD.getAllByUsersId([dataValues.user_2, dataValues.user_1], ['id', 'user_id'])
                        .then(result => {
                          result.forEach(item => {
                            io.to(item.id).emit('New_Message', {
                              message: { user: { firstname, lastname, avatar }, ...res }
                            })
                          })
                        })
                        .catch(errr => {
                          socket.emit('error', { path: 'Send_Message', message: 'error in get online user id for chat!', error: err })
                        })
                    } else {
                      socket.emit('error', { path: 'Send_Message', message: 'not found chat for user_id!', error: errC })
                    }
                  } else {
                    socket.emit('error', { path: 'Send_Message', message: 'Error in get chat for user_id!', error: errC })
                  }
                })
              }
            } else {
              socket.emit('error', { path: 'Send_Message', message: 'Error for send message get online users!', error: errOU })
            }
          })
        } else {
          socket.emit('error', { path: 'Send_Message', message: 'Error in add new message!', error: err })
        }
      })
    })
    .catch(errV => {
      console.log(errV)
      socket.emit('error', { path: 'Send_Message', message: 'Error in validation!', error: errV })
    })
}

export const GetChatMessages = (socket, ref_id, options) => {
  MessagesMD.getByRefId(ref_id, options, (res, err) => {
    if (res) {
      socket.emit('Get_Chat_Messages', res)
    } else
      socket.emit('error', { path: 'Get_Chat_Messages', message: 'Have a problem in get messages!', error: err })
  })
}