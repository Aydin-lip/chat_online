import { io } from 'socket.io-client'

const url = process.env.SOCKET_URL || 'http://localhost:8080'
// const url = process.env.SOCKET_URL || 'http://192.168.10.19:8080'

const socket = io(url + '/chat', {
  autoConnect: false,
  extraHeaders: {
    Authorization: "Bearer authorization_token_here"
  }
})

export default socket