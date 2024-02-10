import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import UsersMD from '../models/users.model.js'
dotenv.config()

const Authorization = (socket, next) => {
  if (socket.user) return next()

  const token = socket.request?.headers?.authorization ?? ''

  jwt.verify(token, process.env.JWT_SECRET, (err, encoded) => {
    if (err) {
      next(new Error('Authentication error!'))
    } else {
      UsersMD.getUserInfo(encoded.user_id, (res, err) => {
        if (!err) {
          socket.user = res
          next()
        } else {
          console.log('user not found! : ', err)
          next(new Error('Database error!'))
        }
      })
    }
  })
}

export default Authorization