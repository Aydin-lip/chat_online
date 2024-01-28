import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import UsersMD from '../models/users.model.js'
dotenv.config()

const Authorization = (event, next, socket) => {
  const token = socket.request?.headers?.authorization ?? ''
  jwt.verify(token, process.env.JWT_SECRET, (err, encoded) => {
    if (err) {
      socket.emit('Authorization', false)
    } else {
      UsersMD.getUserInfo(encoded.user_id, (res, err) => {
        if (!err) {
          socket.user = res
          socket.emit('Authorization', true)
          next()
        } else {
          console.log('user not found! : ', err)
        }
      })
    }
  })
}

export default Authorization