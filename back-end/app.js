require('dotenv').config()
const path = require('path')
const { createServer } = require('http')

const express = require('express')
const { Server } = require('socket.io')
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
  //       text: '',
  //       from: '',
  //       to: '',
  //       time: '',
  //       unVisit: false | 'username',
  //     }
  //   ],
  // }
]

io.on('connection', socket => {

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

      io.to(user.id).emit('users', allUsers)
    })
  }

  socket.on('login', nickname => {
    userName = nickname
    let filterUsers = users.filter(user => user.username !== nickname)
    filterUsers.push({ id: socket.id, username: nickname, online: true })
    users = filterUsers

    io.to(socket.id).emit('nick_name', nickname)

    getUsersHandler()
  })

  socket.on('select_chat', user => {
    let findUser = users.find(u => u.id === user.id)
    users_active_page[userName] = findUser

    io.to(socket.id).emit('get_user', findUser)

    // const usersArray = Object.entries(users_active_page)


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
      io.to(user.id).emit('status', true)
    })

    const active_users_id = activeUser.map(user => user.id)
    const users_id = users.map(user => user.id)
    const deactive = users_id.filter(id => !active_users_id.includes(id) && id)

    deactive?.map(id => {
      io.to(id).emit('status', false)
    })

    returnMessages()
  })

  const returnMessages = () => {
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
        if (message.unVisit === userName) {
          message.unVisit = false
        } else if (inChat) {
          message.unVisit = false
        }
        return message
      })

      filterMessages.push({
        ...findMessages,
        messages: changed
      })

      messages_array = filterMessages

      io.to(socket.id).emit('messages_user', changed)

      if (inChat) {
        io.to(users_active_page[userName]?.id).emit('messages_user', changed)

      }

    } else {
      io.to(socket.id).emit('messages_user', [])
    }

    getUsersHandler()
  }

  socket.on('send_message', data => {
    let findToken = tokens?.find(tok => {
      let splited = tok.token.split('_')
      if (splited.includes(data.to) && splited.includes(userName))
        return tok
    })

    const inChat = users_active_page[data.to]?.username === userName

    let newMessage = {
      text: data.message,
      from: userName,
      to: data.to,
      time: new Date().toLocaleTimeString(),
      unVisit: inChat ? false : data.to
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


  socket.on('disconnect', () => {
    users = users.map(user => user.id === socket.id ? { ...user, online: false } : user)
    getUsersHandler()
  })



  // socket.on('send_message', message => {
  //   io.emit('messages', { message, id: socket.id })
  // })

  // socket.on('typing', data => {
  //   socket.broadcast.emit('user_typing', data)
  // })
})

const port = process.env.PORT || 8008
server.listen(port, () => {
  console.log(`Server is running in PORT ${port}`)
})