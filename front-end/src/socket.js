import { io } from 'socket.io-client'

const url = process.env.SOCKET_URL || 'http://localhost:8080'

const socket = io(url, {
  // autoConnect: false,
  extraHeaders: {
    authorization: localStorage.getItem("token") ?? ''
  }
})

// const connectionHandler = (token) => 

export default socket