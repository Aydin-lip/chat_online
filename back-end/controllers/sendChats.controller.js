import ChatsMD from "../models/chats.model.js"
import GroupsMD from "../models/groups.model.js"
import MessagesMD from "../models/messages.model.js"
import UsersMD from "../models/users.model.js"

export const SendChats = socket => {
  ChatsMD.get(socket.user?.id, (res, err) => {
    if (!err) {
      if (res) {
        const chats = {
          user_Ids: res.map(r => r.user_1 !== socket.user?.id ? r.user_1 : r.user_2),
          chat_Ids: res.map(r => r.id)
        }
        Promise.all(chats.user_Ids.map(id => UsersMD.getUserProfileChat(id)))
          .then(resPU => {
            Promise.all(chats.chat_Ids.map(id => MessagesMD.getByRefIdLast(id)))
              .then(resPC => {
                const allChats = resPU.map((user, idx) => ({ ...user, lastMessage: resPC?.[idx] }))
                socket.emit('Get_Chats', allChats)
              })
              .catch(errPC => {
                socket.emit('error', { path: 'Get_Chats', message: 'In get lastMessage have a problem! (Chats)', error: errPC })
              })
          })
          .catch(errPU => {
            socket.emit('error', { path: 'Get_Chats', message: 'In get users profile Chat have a problem!', error: errPU })
          })
      } else {
        socket.emit('error', { path: 'Get_Chats', message: 'No have data in Chats', error: res })
      }
    } else {
      socket.emit('error', { path: 'Get_Chats', message: 'In get Chats hava a problem!', error: err })
    }
  })
}

export const SendGroups = socket => {
  GroupsMD.getGroupsById(socket.user?.id, (res, err) => {
    if (!err) {
      if (res) {
        const ids = res.map(r => r.id)

        Promise.all(ids.map(id => MessagesMD.getByRefIdLast(id, true)))
          .then(resPG => {
            const allGroups = res.map((r, idx) => ({ ...r, lastMessage: resPG[idx] }))
            socket.emit('Get_Groups', allGroups)
          })
          .catch(errPG => {
            socket.emit('error', { path: 'Get_Chats', message: 'In get lastMessage have a problem! (Groups)', error: errPG })
          })

      } else {
        socket.emit('error', { path: 'Get_Groups', message: 'No have data in Groups', error: res })
      }
    } else {
      socket.emit('error', { path: 'Get_Groups', message: 'In get Groups hava a problem!', error: err })
    }
  })
}