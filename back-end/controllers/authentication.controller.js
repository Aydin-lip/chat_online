import jwt from 'jsonwebtoken'
import dot from 'dotenv'
import UsersMD from "../models/users.model.js"
import { SignInValidation, SingUpValidation } from "../validations/users.validation.js"

dot.config()

const SignIn = (value, socket) => {
  SignInValidation.validate(value, { abortEarly: false })
    .then(res => {
      const User = new UsersMD(value)
      User.login((ress, err) => {
        if (!err) {
          const token = jwt.sign({ user_id: ress.id }, process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM })
          socket.emit('Sign-In', { ...ress, token })
        } else {
          socket.emit('error', { path: 'Sign-In', status: 400, message: 'Error database!', error: err.message })
        }
      })
    })
    .catch(err => {
      socket.emit('error', { path: 'Sign-In', status: 412, message: 'Error message for validation', error: err.errors })
    })
}

const SignUp = (value, socket) => {
  SingUpValidation.validate(value, { abortEarly: false })
    .then(res => {
      const User = new UsersMD(value)
      User.register((ress, err) => {
        if (!err) {
          const token = jwt.sign({ user_id: ress.id }, process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM })
          socket.emit('Sign-Up', { ...ress, token })
        } else {
          socket.emit('error', { path: 'Sign-Up', status: 400, message: 'Error database!', error: err.message })
        }
      })
    })
    .catch(err => {
      socket.emit('error', { path: 'Sign-Up', status: 412, message: 'Error message for validation', error: err.errors })
    })
}

export {
  SignIn,
  SignUp
}