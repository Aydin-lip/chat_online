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

let online_users = {}

io.on('connection', socket => {

  let userName
  socket.on('login', nickname => {
    userName = nickname
    online_users[nickname] = socket.id

    io.to(socket.id).emit('nick_name', nickname)

    io.emit('online_users', online_users)
  })



  socket.on('select_user', user => {
    const obj_users = Object.entries(online_users).map(user => ({ username: user[0], id: user[1] }))
    let select_user = obj_users.find(u => u.id === user.id)
    io.to(socket.id).emit('get_user', select_user)
  })


  socket.on('disconnect', () => {
    delete online_users[userName]
    io.emit('online_users', online_users)
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