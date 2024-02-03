import ChatsMD from "../models/chats.model.js"
import GroupsMD from "../models/groups.model.js"
import MessagesMD from "../models/messages.model.js"
import UsersMD from "../models/users.model.js"

export const SendPrivetChats = socket => {
  ChatsMD.get(socket.user?.id, async (res, err) => {
    if (!err) {
      if (res) {
        const chats = {
          user_Ids: res.map(r => r.user_1 !== socket.user?.id ? r.user_1 : r.user_2),
          chat_Ids: res.map(r => r.id)
        }

        try {
          const resultUP = await Promise.all(chats.user_Ids.map(id => UsersMD.getUserProfileChat(id)))
          const resultLM = await Promise.all(chats.chat_Ids.map(id => MessagesMD.getByRefIdLast(id)))
          const resultCN = await Promise.all(chats.chat_Ids.map(id => MessagesMD.countByRefIdNotSeen(id, socket.user?.id)))

          const allChats = resultUP.map((user, idx) => ({ ...user, notSeenMessages: resultCN?.[idx]?.count, lastMessage: resultLM?.[idx] }))
          socket.emit('Get_Chats', allChats)
        } catch (error) {
          socket.emit('error', { path: 'Get_Chats', message: 'In get Users & LastMessage & Not seen messages  have a problem! (Chats)', error })

        }

      } else {
        socket.emit('error', { path: 'Get_Chats', message: 'No have data in Chats', error: res })
      }
    } else {
      socket.emit('error', { path: 'Get_Chats', message: 'In get Chats hava a problem!', error: err })
    }
  })
}

export const SendGroups = socket => {
  GroupsMD.getGroupsByUserId(socket.user?.id, async (res, err) => {
    if (!err) {
      if (res) {
        const ids = res.map(r => r.id)

        try {
          const resultLM = await Promise.all(ids.map(id => MessagesMD.getByRefIdLast(id)))
          const resultCN = await Promise.all(ids.map(id => MessagesMD.countByRefIdNotSeen(id, socket.user?.id)))
          const resultUC = await Promise.all(resultLM.map(({ user_id }) => UsersMD.getUserCustomInfo(user_id, ['firstname', 'lastname'])))

          const allGroups = res.map((r, idx) => ({ ...r, notSeenMessages: resultCN?.[idx]?.count, lastMessage: { user: resultUC[idx], ...resultLM[idx] } }))
          socket.emit('Get_Groups', allGroups)

        } catch (error) {
          socket.emit('error', { path: 'Get_Groups', message: 'In get Not seen messages or LastMessage have a problem! (Groups)', error })
        }

      } else {
        socket.emit('error', { path: 'Get_Groups', message: 'No have data in Groups', error: res })
      }
    } else {
      socket.emit('error', { path: 'Get_Groups', message: 'In get Groups hava a problem!', error: err })
    }
  })
}