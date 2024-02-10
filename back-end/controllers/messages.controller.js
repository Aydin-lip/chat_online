import MessagesMD from "../models/messages.model.js"
import OnlineUsersMD from "../models/online_users.model.js"
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

export const SendMessage = (socket, data) => {
  AddNewMessageValidation.validate(data, { abortEarly: false })
    .then(resV => {
      const message = new MessagesMD({ ...data, user_id: socket.user?.id })
      message.add((res, err) => {
        if (!err) {
          OnlineUsersMD.getAllByChatId(data.ref_id, [], (resO, errO) => {
            if (!errO) {
              resO.map(user => {
                socket.to(user?.id).emit('New_Message', { message: res })
              })
            } else {
              socket.emit('error', { path: 'Send_Message', message: 'Error for send message get online users!', error: errO })
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