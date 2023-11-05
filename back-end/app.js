require('dotenv').config()
const path = require('path')
const fs = require('fs')
const os = require('os')
const { createServer } = require('http')

const express = require('express')
const { Server } = require('socket.io')
const { v4: uuidV4 } = require('uuid')

const { AccessControllers } = require('./middleware/headers')

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: '*'
  }
})

app.use(AccessControllers)

// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))

io.use((socket, next) => {
  // console.log(socket.request.headers.authorization)
  next()
})

let users = [
  // {
  //   id: '',
  //   username: '',
  //   online: true
  // }
]
let online_users = {}
let users_active_page = {
  // 'aydin lip': {id: '', username: ''}
}
let tokens = [
  // {
  //   id: '',
  //   token: 'from_to'
  // }
]
let messages_array = [
  // {
  //   id: '',
  //   messages: [
  //     {
  //       id: '',
  //       type: 'message' | 'file',
  //       name: '',
  //       text: '',
  //       from: '',
  //       to: '',
  //       time: '',
  //       unVisit: false | 'username',
  //     }
  //   ],
  // }
]

const chatNS = io.of('/chat')

chatNS.on('connection', socket => {

  let userName

  const getUsersHandler = () => {
    users.forEach(user => {

      let allUsers = users.map(u => {
        let obj_user = {
          ...u
        }
        const findToken = tokens.find(token => {
          let splited = token.token.split('_')
          if (user.username !== u.username && splited.includes(user.username) && splited.includes(u.username)) {
            return token
          }
        })
        if (findToken) {
          const findMessages = messages_array.find(messages => messages.id === findToken.id)
          const notSeenMessages = findMessages.messages.filter(mess => mess.unVisit === user.username)
          const lastMessage = findMessages.messages[findMessages.messages?.length - 1]

          obj_user.last_message = lastMessage
          obj_user.unVisit_count = notSeenMessages.length
        } else
          obj_user.last_message = {}

        return obj_user
      })

      chatNS.to(user.id).emit('users', allUsers)
    })
  }

  socket.on('login', nickname => {
    userName = nickname
    let filterUsers = users.filter(user => user.username !== nickname)
    filterUsers.push({ id: socket.id, username: nickname, online: true })
    users = filterUsers

    chatNS.to(socket.id).emit('nick_name', nickname)

    getUsersHandler()
  })

  socket.on('select_chat', user => {
    let findUser = users.find(u => u.id === user.id)
    users_active_page[userName] = findUser

    chatNS.to(socket.id).emit('get_user', findUser)


    let activeUser = []
    for (let i = 0; i < users.length; i++) {

      for (let x = 0; x < users.length; x++) {

        if (
          users_active_page[users[i].username]?.username === users[x].username &&
          users_active_page[users[x].username]?.username === users[i].username
        ) {
          if (!activeUser.find(user => user.id === users[i].id)) {
            activeUser.push(users[i])

            if (!activeUser.find(user => user.id === users[x].id)) {
              activeUser.push(users[x])
            }
          }
        }

      }
    }

    activeUser?.map(user => {
      chatNS.to(user.id).emit('status', true)
    })

    const active_users_id = activeUser.map(user => user.id)
    const users_id = users.map(user => user.id)
    const deactive = users_id.filter(id => !active_users_id.includes(id) && id)

    deactive?.map(id => {
      chatNS.to(id).emit('status', false)
    })

    returnMessages()
  })

  const returnMessages = async () => {
    let findToken = tokens?.find(tok => {
      let splited = tok.token.split('_')
      if (splited.includes(users_active_page[userName]?.username) && splited.includes(userName))
        return tok
    })
    if (findToken) {
      const mySelect = users_active_page[userName]?.username
      const inChat = users_active_page[mySelect]?.username === userName

      let findMessages = messages_array.find(messages => messages.id === findToken.id)
      let filterMessages = messages_array.filter(messages => messages.id !== findToken.id)

      let changed = findMessages.messages?.map(message => {
        if (message.unVisit === userName || inChat) {
          message.unVisit = false
        }

        return message
      })

      filterMessages.push({
        ...findMessages,
        messages: changed
      })

      messages_array = filterMessages

      const message_array = changed.map(mess => {
        if (mess.type === 'File')
          mess.file = fs.readFileSync(path.join('public', 'uploads', mess.path))

        return mess
      })

      chatNS.to(socket.id).emit('messages_user', message_array)

      if (inChat) {
        chatNS.to(users_active_page[userName]?.id).emit('messages_user', message_array)
      }

    } else {
      chatNS.to(socket.id).emit('messages_user', [])
    }

    getUsersHandler()
  }

  const saveFileHandler = async (name, file) => {
    const splitN = name.split(".")
    const format = splitN[splitN.length - 1]
    const joinN = splitN.filter(s => s !== format).join('.')
    const newN = `${joinN}&&${uuidV4()}.${format}`
    try {
      await fs.writeFileSync(path.join(__dirname, 'public', 'uploads', newN), file)
      return newN
    } catch (error) {
      console.log(error)
      return ''
    }
  }

  socket.on('send_message', async data => {
    let findToken = tokens?.find(tok => {
      let splited = tok.token.split('_')
      if (splited.includes(data.to) && splited.includes(userName))
        return tok
    })

    const inChat = users_active_page[data.to]?.username === userName

    let newMessage = {
      id: uuidV4(),
      type: data.type,
      from: userName,
      to: data.to,
      time: new Date().toLocaleTimeString(),
      unVisit: inChat ? false : data.to
    }

    switch (data.type) {
      case 'Message':
        newMessage.text = data.message
        break
      case 'File':
        newMessage.name = data.name
        newMessage.path = await saveFileHandler(data.name, data.file)
        newMessage.file_type = data.file_type
        break

      default:
        break;
    }

    if (findToken) {
      let findMessages = messages_array.find(messages => messages.id === findToken.id)
      let filterMessages = messages_array.filter(messages => messages.id !== findToken.id)
      findMessages.messages.push(newMessage)
      messages_array = [...filterMessages, findMessages]
    } else {
      const id = new Date().getTime()
      tokens.push({ id, token: `${userName}_${data.to}` })
      messages_array.push({ id, messages: [newMessage] })
    }

    returnMessages()
  })

  socket.on('typing', type => {
    const mySelect = users_active_page[userName]
    const inChat = users_active_page[mySelect?.username]?.username === userName
    if (inChat) {
      chatNS.to(mySelect?.id).emit('user_typing', type)
    }
  })

  socket.on('disconnect', () => {
    delete users_active_page[userName]
    users = users.map(user => user.id === socket.id ? { ...user, online: false } : user)
    getUsersHandler()
  })

})

const port = process.env.PORT || 8008
server.listen(port, () => {
  console.log(`Server is running in PORT ${port}`)
})