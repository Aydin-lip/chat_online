import ChatsMD from "../models/chats.model.js"
import GroupsMD from "../models/groups.model.js"
import MessagesMD from "../models/messages.model.js"
import UsersMD from "../models/users.model.js"
import { AddNewMessageValidation } from "../validations/messages.validation.js"

export const SeenMessages = (socket, ids) => {
  MessagesMD.addSeen(ids, socket.user?.id, (res, err) => {
    if (!err) {
      socket.emit('Seen_Messages', { message_ids: ids, message: 'Success seen.' })
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
                ChatsMD.getById(data.ref_id, ({ dataValues }, errC) => {
                  if (!errC) {
                    if (dataValues) {
                      const id = dataValues.user_1 == socket.user.id ? dataValues.user_2 : dataValues.user_1
                      io.to(id).emit('New_Message', {
                        message: { user: { firstname, lastname, avatar }, ...res }
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