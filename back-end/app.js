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
  console.log(socket.request.headers.authorization)
  next()
})

io.on('connection', socket => {
  console.log('user connected')


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