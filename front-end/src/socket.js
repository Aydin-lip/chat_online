import { io } from 'socket.io-client'

const url = process.env.SOCKET_URL || 'http://localhost:8080'

const socket = io(url, {
  autoConnect: false,
  extraHeaders: {
    Authorization: "Bearer authorization_token_here"
  }
})

export default socket