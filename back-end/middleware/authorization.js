import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import UsersMD from '../models/users.model.js'
dotenv.config()

const Authorization = (socket, next) => {
  const token = socket.request.headers.authorization
  jwt.verify(token, process.env.JWT_SECRET, (err, encoded) => {
    if (err) {
      socket.to(socket.id).emit('Authorization', false)
    } else {
      UsersMD.getUserInfo(encoded.user_id, (res, err) => {
        if (!err) {
          socket.user = res
          next()
        } else {
          console.log('user not found! : ', err)
        }
      })
    }
  })
}

export default Authorization