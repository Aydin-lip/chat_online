import { io } from 'socket.io-client'

const url = process.env.SOCKET_URL || 'http://localhost:8080'
// const url = process.env.SOCKET_URL || 'http://192.168.10.19:8080'

const socket = io(url, {
  autoConnect: false,
  extraHeaders: {
    Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3MDYzNTUwMTEsImV4cCI6MTcwNjM1ODYxMX0.bt55Is2NZ2TRMfLu3f4kDE7AMO_eXgIg4MAcfRhOwHc"
  }
})

export default socket