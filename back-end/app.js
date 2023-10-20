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
  //       time: ''
  //     }
  //   ],
  //   unvisited: {
  //     count: 0,
  //     for: ''
  //   }
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
          const findMessage = messages_array.find(messages => messages.id === findToken.id)
          const lastMessage = findMessage.messages[findMessage.messages?.length - 1]
          obj_user.last_message = lastMessage
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

  socket.on('select_user', user => {
    users_active_page[userName] = users.find(u => u.id === user.id)

    io.to(socket.id).emit('get_user', users_active_page[userName])

    returnMessages()
  })

  const returnMessages = () => {
    let findToken = tokens?.find(tok => {
      let splited = tok.token.split('_')
      if (splited.includes(users_active_page[userName]?.username) && splited.includes(userName))
        return tok
    })
    if (findToken) {
      let findMessages = messages_array.find(messages => messages.id === findToken.id)
      const messages = findMessages.messages

      io.to(socket.id).emit('messages_user', messages)

      const mySelect = users_active_page[userName]?.username
      if (users_active_page[mySelect]?.username === userName)
        io.to(users_active_page[userName]?.id).emit('messages_user', messages)

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

    let newMessage = {
      text: data.message,
      from: userName,
      to: data.to,
      time: new Date().toLocaleTimeString()
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