require('dotenv').config()
const path = require('path')
const { createServer } = require('http')

const express = require('express')
const { Server } = require('socket.io')

const app = express()
const server = createServer(app)
const io = new Server(server)

io.on('connection', socket => {

  socket.on('send_message', message => {
    io.emit('messages', { message, id: socket.id })
  })

  socket.on('typing', data => {
    socket.broadcast.emit('user_typing', data)
  })

})

const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`Server is running in PORT ${port}`)
})